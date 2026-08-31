import React, { useState, useEffect } from 'react';
import { ActiveTab, Question, StudyStats, UserAnswerRecord } from './types';
import { allQuestions } from './data/allQuestions';
import { Header } from './components/Header';
import { PracticeMode } from './components/PracticeMode';
import { PatternLab } from './components/PatternLab';
import { ExamMode } from './components/ExamMode';
import { MistakeBook } from './components/MistakeBook';
import { FormulaGuide } from './components/FormulaGuide';
import { AnalyticsView } from './components/AnalyticsView';
import { AITutorModal } from './components/AITutorModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import {
  StudyReminderSettingsModal,
  GentleAlertModal,
  StudyReminderConfig,
  playGentleChime,
} from './components/StudyReminder';

const STATS_STORAGE_KEY = 'beisen_study_stats_v1';
const RECORDS_STORAGE_KEY = 'beisen_answer_records_v1';
const FAVORITES_STORAGE_KEY = 'beisen_favorites_v1';
const NOTES_STORAGE_KEY = 'beisen_notes_v1';
const REMINDER_STORAGE_KEY = 'beisen_study_reminder_v2';

const INITIAL_STATS: StudyStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  streakDays: 1,
  categoryStats: {
    verbal: { total: 0, correct: 0, timeSpentSec: 0 },
    data: { total: 0, correct: 0, timeSpentSec: 0 },
    graphic: { total: 0, correct: 0, timeSpentSec: 0 },
  },
  mistakeIds: [],
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Stats State
  const [stats, setStats] = useState<StudyStats>(() => {
    const cached = localStorage.getItem(STATS_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return INITIAL_STATS;
  });

  // User Answer Records
  const [answerRecords, setAnswerRecords] = useState<UserAnswerRecord[]>(() => {
    const cached = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return [];
  });

  // Answered map (questionId -> user selected option)
  const answeredMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    answerRecords.forEach((r) => {
      map[r.questionId] = r.userAnswer;
    });
    return map;
  }, [answerRecords]);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const cached = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return [];
  });

  // Notes
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const cached = localStorage.getItem(NOTES_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return {};
  });

  // Study Reminder State (persisted in localStorage)
  const [reminderConfig, setReminderConfig] = useState<StudyReminderConfig | null>(() => {
    const cached = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return null;
  });

  const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);
  const [isGentleAlertOpen, setIsGentleAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Active AI engine label (Gemini / DeepSeek), fetched from server
  const [engineLabel, setEngineLabel] = useState<string>('AI 智能引擎');

  // AI Tutor Modal
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    question: Question | null;
    defaultTab: 'explain' | 'graphic' | 'variant' | 'chat';
  }>({
    isOpen: false,
    question: allQuestions[0] || null,
    defaultTab: 'explain',
  });

  const [practiceFilters, setPracticeFilters] = useState<{
    category: 'all' | 'verbal' | 'data' | 'graphic';
    subCategory: string;
  }>({
    category: 'all',
    subCategory: 'all',
  });

  const handleSelectSubCategoryFromGraph = (category: string, subCategory: string) => {
    setPracticeFilters({
      category: category as any,
      subCategory: subCategory,
    });
    setActiveTab('practice');
  };

  // Fetch active AI engine info once
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.label) setEngineLabel(data.label);
      })
      .catch(() => {});
  }, []);

  // Compute real streak days from answer records (consecutive active days)
  useEffect(() => {
    if (answerRecords.length === 0) return;
    const activeDays = new Set(answerRecords.map((r) => r.answeredAt.slice(0, 10)));
    const day = new Date();
    const todayStr = day.toISOString().slice(0, 10);
    if (!activeDays.has(todayStr)) day.setDate(day.getDate() - 1); // streak survives until yesterday
    let streak = 0;
    while (activeDays.has(day.toISOString().slice(0, 10))) {
      streak += 1;
      day.setDate(day.getDate() - 1);
    }
    if (streak > 0) {
      setStats((prev) => (prev.streakDays === streak ? prev : { ...prev, streakDays: streak }));
    }
  }, [answerRecords]);

  // Study Reminder Background Check & Push Loop
  useEffect(() => {
    if (!reminderConfig || !reminderConfig.enabled || reminderConfig.hasTriggered || !reminderConfig.targetTimestamp) {
      return;
    }

    const checkTimer = () => {
      if (reminderConfig.enabled && !reminderConfig.hasTriggered && reminderConfig.targetTimestamp) {
        if (Date.now() >= reminderConfig.targetTimestamp) {
          // Timer reached!
          const updated: StudyReminderConfig = {
            ...reminderConfig,
            hasTriggered: true,
          };
          setReminderConfig(updated);
          localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(updated));

          if (reminderConfig.soundEnabled) {
            playGentleChime();
          }

          setAlertMessage(
            reminderConfig.message || '🌱 专注时光圆满达成，起来喝口温水，眺望远方放松一下眼睛吧！'
          );
          setIsGentleAlertOpen(true);
        }
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [reminderConfig]);

  const handleUpdateReminderConfig = (config: StudyReminderConfig | null) => {
    setReminderConfig(config);
    if (config) {
      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(REMINDER_STORAGE_KEY);
    }
  };

  const handleSnoozeReminder = (minutes: number) => {
    const targetMs = Date.now() + minutes * 60 * 1000;
    const updated: StudyReminderConfig = {
      enabled: true,
      targetTimestamp: targetMs,
      durationMinutes: minutes,
      message: reminderConfig?.message || '☕ 休息结束啦，元气满满继续专注！',
      soundEnabled: reminderConfig?.soundEnabled ?? true,
      hasTriggered: false,
      createdAt: Date.now(),
    };
    handleUpdateReminderConfig(updated);
    setIsGentleAlertOpen(false);
    if (updated.soundEnabled) {
      playGentleChime();
    }
  };

  // Persist states
  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(answerRecords));
  }, [answerRecords]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Record Answer Callback
  const handleRecordAnswer = (record: UserAnswerRecord) => {
    setAnswerRecords((prev) => {
      const filtered = prev.filter((r) => r.questionId !== record.questionId);
      return [record, ...filtered];
    });

    setStats((prev) => {
      const q = allQuestions.find((item) => item.id === record.questionId);
      const catKey = q?.category || 'verbal';

      const prevCat = prev.categoryStats[catKey] || { total: 0, correct: 0, timeSpentSec: 0 };
      const newCat = {
        total: prevCat.total + 1,
        correct: prevCat.correct + (record.isCorrect ? 1 : 0),
        timeSpentSec: prevCat.timeSpentSec + record.timeSpentSec,
      };

      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (record.isCorrect ? 1 : 0),
        categoryStats: {
          ...prev.categoryStats,
          [catKey]: newCat,
        },
      };
    });
  };

  // Reset single question answer
  const handleResetAnswer = (qId: string) => {
    const existingRec = answerRecords.find((r) => r.questionId === qId);
    setAnswerRecords((prev) => prev.filter((r) => r.questionId !== qId));

    if (existingRec) {
      setStats((prev) => {
        const q = allQuestions.find((item) => item.id === qId);
        const catKey = q?.category || 'verbal';
        const prevCat = prev.categoryStats[catKey] || { total: 0, correct: 0, timeSpentSec: 0 };
        const newCat = {
          total: Math.max(0, prevCat.total - 1),
          correct: Math.max(0, prevCat.correct - (existingRec.isCorrect ? 1 : 0)),
          timeSpentSec: Math.max(0, prevCat.timeSpentSec - existingRec.timeSpentSec),
        };

        return {
          ...prev,
          totalAnswered: Math.max(0, prev.totalAnswered - 1),
          totalCorrect: Math.max(0, prev.totalCorrect - (existingRec.isCorrect ? 1 : 0)),
          categoryStats: {
            ...prev.categoryStats,
            [catKey]: newCat,
          },
        };
      });
    }
  };

  // Mistake Management
  const handleAddMistake = (qId: string) => {
    setStats((prev) => {
      if (prev.mistakeIds.includes(qId)) return prev;
      return {
        ...prev,
        mistakeIds: [qId, ...prev.mistakeIds],
      };
    });
  };

  const handleRemoveMistake = (qId: string) => {
    setStats((prev) => ({
      ...prev,
      mistakeIds: prev.mistakeIds.filter((id) => id !== qId),
    }));
  };

  const handleClearMistakes = () => {
    setStats((prev) => ({
      ...prev,
      mistakeIds: [],
    }));
  };

  // Favorites & Notes
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveNote = (id: string, note: string) => {
    setNotes((prev) => ({ ...prev, [id]: note }));
  };

  // Open AI Modal
  const handleOpenAI = (
    tab: 'explain' | 'graphic' | 'variant' | 'chat',
    question?: Question
  ) => {
    setAiModal({
      isOpen: true,
      question: question || aiModal.question || allQuestions[0],
      defaultTab: tab,
    });
  };

  // Safe Global Reset without window.confirm blocking iframe
  const handleConfirmResetStats = () => {
    localStorage.removeItem(STATS_STORAGE_KEY);
    localStorage.removeItem(RECORDS_STORAGE_KEY);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    localStorage.removeItem(NOTES_STORAGE_KEY);

    // Reset In-Memory React State immediately
    setStats(INITIAL_STATS);
    setAnswerRecords([]);
    setFavorites([]);
    setNotes({});
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans antialiased selection:bg-[#b45309] selection:text-white">
      {/* Top App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenAIChat={() => handleOpenAI('chat')}
        onResetStats={() => setIsResetModalOpen(true)}
        reminderConfig={reminderConfig}
        onOpenReminderModal={() => setIsReminderSettingsOpen(true)}
      />

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'practice' && (
          <PracticeMode
            onOpenAI={handleOpenAI}
            onRecordAnswer={handleRecordAnswer}
            onResetAnswer={handleResetAnswer}
            onAddMistake={handleAddMistake}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            notes={notes}
            onSaveNote={handleSaveNote}
            answeredMap={answeredMap}
            initialCategory={practiceFilters.category}
            initialSubCategory={practiceFilters.subCategory}
            stats={stats}
            answerRecords={answerRecords}
            onNavigateToSubCategory={handleSelectSubCategoryFromGraph}
          />
        )}

        {activeTab === 'graphic-lab' && <PatternLab />}

        {activeTab === 'exam' && (
          <ExamMode
            onOpenAI={handleOpenAI}
            onRecordAnswer={handleRecordAnswer}
            onAddMistake={handleAddMistake}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            notes={notes}
            onSaveNote={handleSaveNote}
            stats={stats}
            answerRecords={answerRecords}
          />
        )}

        {activeTab === 'mistakes' && (
          <MistakeBook
            mistakeIds={stats.mistakeIds}
            onRemoveMistake={handleRemoveMistake}
            onClearAllMistakes={handleClearMistakes}
            onOpenAI={handleOpenAI}
            onRecordAnswer={handleRecordAnswer}
            onResetAnswer={handleResetAnswer}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            notes={notes}
            onSaveNote={handleSaveNote}
            answeredMap={answeredMap}
            stats={stats}
            answerRecords={answerRecords}
            onNavigateToSubCategory={handleSelectSubCategoryFromGraph}
          />
        )}

        {activeTab === 'cheatsheet' && <FormulaGuide />}

        {activeTab === 'analytics' && (
          <AnalyticsView
            stats={stats}
            answerRecords={answerRecords}
            onSelectSubCategory={handleSelectSubCategoryFromGraph}
          />
        )}
      </main>

      {/* Global AI Tutor Popup & Drawer */}
      <AITutorModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal({ ...aiModal, isOpen: false })}
        question={aiModal.question}
        defaultTab={aiModal.defaultTab}
        selectedOption={aiModal.question ? answeredMap[aiModal.question.id] : undefined}
      />

      {/* Custom Reset Confirm Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmResetStats}
        answeredCount={stats.totalAnswered}
        mistakeCount={stats.mistakeIds.length}
      />

      {/* Study Reminder Settings Modal */}
      <StudyReminderSettingsModal
        isOpen={isReminderSettingsOpen}
        onClose={() => setIsReminderSettingsOpen(false)}
        activeConfig={reminderConfig}
        onUpdateConfig={handleUpdateReminderConfig}
        onTriggerAlert={(msg) => {
          setAlertMessage(msg);
          setIsGentleAlertOpen(true);
        }}
      />

      {/* Gentle In-Page Alert Popup Modal */}
      <GentleAlertModal
        isOpen={isGentleAlertOpen}
        message={alertMessage}
        onClose={() => setIsGentleAlertOpen(false)}
        onSnooze={handleSnoozeReminder}
      />

      {/* Footer */}
      <footer className="border-t border-[#e3d9c4] bg-[#fdfbf7] py-6 mt-12 text-center text-xs text-[#786c5e]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 北森测评智能备考学习平台 · 全真题库 & AI 思维链智能导学系统</span>
          <div className="flex items-center gap-4 text-[#8c7e6d]">
            <span>言语理解</span>
            <span>·</span>
            <span>资料分析</span>
            <span>·</span>
            <span>复杂图推</span>
            <span>·</span>
            <span>{engineLabel} 引擎驱动</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;


