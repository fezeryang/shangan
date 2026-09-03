import React, { useState, useEffect, useMemo } from "react";
import type {
  ActiveTab,
  AIQuestion,
  AnswerAttempt,
  Question,
  StudyStats,
  UserAnswerRecord,
} from "./types";
import { allQuestions } from "./data/allQuestions";
import { latestRecords } from "./data/analytics";
import { Header } from "./components/Header";
import { PracticeMode } from "./components/PracticeMode";
import { PatternLab } from "./components/PatternLab";
import { ExamMode } from "./components/ExamMode";
import { MistakeBook } from "./components/MistakeBook";
import { FormulaGuide } from "./components/FormulaGuide";
import { AnalyticsView, COLLAPSE_STORAGE_KEY } from "./components/AnalyticsView";
import { AITutorModal } from "./components/AITutorModal";
import { AIVariantBank } from "./components/AIVariantBank";
import { ResetConfirmModal } from "./components/ResetConfirmModal";
import {
  StudyReminderSettingsModal,
  GentleAlertModal,
  type StudyReminderConfig,
  playGentleChime,
} from "./components/StudyReminder";

const STATS_STORAGE_KEY = "shangan_study_stats_v1";
const RECORDS_STORAGE_KEY = "shangan_answer_records_v1"; // 仅读取：v2 上线后的迁移源
const ATTEMPTS_STORAGE_KEY = "shangan_answer_attempts_v2";
const FAVORITES_STORAGE_KEY = "shangan_favorites_v1";
const NOTES_STORAGE_KEY = "shangan_notes_v1";
const REMINDER_STORAGE_KEY = "shangan_study_reminder_v2";
const AI_BANK_STORAGE_KEY = "shangan_ai_variant_bank_v1";
const AI_BANK_RECORDS_STORAGE_KEY = "shangan_ai_variant_records_v1";

// ponytail: 一次性 key 迁移（beisen_* → shangan_* 品牌去名），稳定一个版本后可删
for (const [from, to] of [
  ["beisen_study_stats_v1", STATS_STORAGE_KEY],
  ["beisen_answer_records_v1", RECORDS_STORAGE_KEY],
  ["beisen_answer_attempts_v2", ATTEMPTS_STORAGE_KEY],
  ["beisen_favorites_v1", FAVORITES_STORAGE_KEY],
  ["beisen_notes_v1", NOTES_STORAGE_KEY],
  ["beisen_study_reminder_v2", REMINDER_STORAGE_KEY],
  ["beisen_ai_variant_bank_v1", AI_BANK_STORAGE_KEY],
  ["beisen_ai_variant_records_v1", AI_BANK_RECORDS_STORAGE_KEY],
  ["beisen_analytics_collapse_v1", COLLAPSE_STORAGE_KEY],
] as const) {
  if (localStorage.getItem(to) === null) {
    const legacy = localStorage.getItem(from);
    if (legacy !== null) {
      localStorage.setItem(to, legacy);
      localStorage.removeItem(from);
    }
  }
}

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
  const [activeTab, setActiveTab] = useState<ActiveTab>("practice");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Stats State
  const [stats, setStats] = useState<StudyStats>(() => {
    const cached = localStorage.getItem(STATS_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        localStorage.removeItem(STATS_STORAGE_KEY);
      }
    }
    return INITIAL_STATS;
  });

  // User Answer Attempts（append-only 历史，滚动上限 500 条）
  // ponytail: 全局滚动窗口，更早的作答轨迹会被淘汰；需要更长历史时调大上限
  const [answerAttempts, setAnswerAttempts] = useState<AnswerAttempt[]>(() => {
    const cached = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
      }
    }
    // v1 迁移：旧版仅存每题最新一次作答，将其作为初始历史
    const v1 = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (v1) {
      try {
        return JSON.parse(v1);
      } catch {
        // 迁移失败按空数据降级，不阻塞
      }
    }
    return [];
  });

  // 每题最新一次作答：全站统计口径（看板/错题本/练习均以此为唯一数据源）
  const answerRecords = useMemo(
    () => latestRecords(answerAttempts),
    [answerAttempts],
  );

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
      } catch {
        localStorage.removeItem(FAVORITES_STORAGE_KEY);
      }
    }
    return [];
  });

  // Notes
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const cached = localStorage.getItem(NOTES_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        localStorage.removeItem(NOTES_STORAGE_KEY);
      }
    }
    return {};
  });

  // AI 举一反三变式题库（独立于真题库，含题目与作答记录）
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>(() => {
    const cached = localStorage.getItem(AI_BANK_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        localStorage.removeItem(AI_BANK_STORAGE_KEY);
      }
    }
    return [];
  });

  const [aiAnswerRecords, setAiAnswerRecords] = useState<UserAnswerRecord[]>(
    () => {
      const cached = localStorage.getItem(AI_BANK_RECORDS_STORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          localStorage.removeItem(AI_BANK_RECORDS_STORAGE_KEY);
        }
      }
      return [];
    },
  );

  // Study Reminder State (persisted in localStorage)
  const [reminderConfig, setReminderConfig] =
    useState<StudyReminderConfig | null>(() => {
      const cached = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          localStorage.removeItem(REMINDER_STORAGE_KEY);
        }
      }
      return null;
    });

  const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);
  const [isGentleAlertOpen, setIsGentleAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // AI Tutor Modal
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    question: Question | null;
    defaultTab: "explain" | "graphic" | "variant" | "chat";
  }>({
    isOpen: false,
    question: allQuestions[0] || null,
    defaultTab: "explain",
  });

  const [practiceFilters, setPracticeFilters] = useState<{
    category: "all" | "verbal" | "data" | "graphic";
    subCategory: string;
  }>({
    category: "all",
    subCategory: "all",
  });

  const handleSelectSubCategoryFromGraph = (
    category: string,
    subCategory: string,
  ) => {
    setPracticeFilters({
      category: category as any,
      subCategory: subCategory,
    });
    setActiveTab("practice");
  };

  // Compute real streak days from answer records (consecutive active days)
  useEffect(() => {
    if (answerRecords.length === 0) return;
    const activeDays = new Set(
      answerRecords.map((r) => r.answeredAt.slice(0, 10)),
    );
    const day = new Date();
    const todayStr = day.toISOString().slice(0, 10);
    if (!activeDays.has(todayStr)) day.setDate(day.getDate() - 1); // streak survives until yesterday
    let streak = 0;
    while (activeDays.has(day.toISOString().slice(0, 10))) {
      streak += 1;
      day.setDate(day.getDate() - 1);
    }
    if (streak > 0) {
      setStats((prev) =>
        prev.streakDays === streak ? prev : { ...prev, streakDays: streak },
      );
    }
  }, [answerRecords]);

  // Study Reminder Background Check & Push Loop
  useEffect(() => {
    if (
      !reminderConfig ||
      !reminderConfig.enabled ||
      reminderConfig.hasTriggered ||
      !reminderConfig.targetTimestamp
    ) {
      return;
    }

    const checkTimer = () => {
      if (
        reminderConfig.enabled &&
        !reminderConfig.hasTriggered &&
        reminderConfig.targetTimestamp
      ) {
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
            reminderConfig.message ||
              "🌱 专注时光圆满达成，起来喝口温水，眺望远方放松一下眼睛吧！",
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
      message: reminderConfig?.message || "☕ 休息结束啦，元气满满继续专注！",
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
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(answerAttempts));
  }, [answerAttempts]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(AI_BANK_STORAGE_KEY, JSON.stringify(aiQuestions));
  }, [aiQuestions]);

  useEffect(() => {
    localStorage.setItem(
      AI_BANK_RECORDS_STORAGE_KEY,
      JSON.stringify(aiAnswerRecords),
    );
  }, [aiAnswerRecords]);

  // Record Answer Callback
  const handleRecordAnswer = (record: UserAnswerRecord) => {
    setAnswerAttempts((prev) => [...prev, record].slice(-500));

    setStats((prev) => {
      const q = allQuestions.find((item) => item.id === record.questionId);
      const catKey = q?.category || "verbal";

      const prevCat = prev.categoryStats[catKey] || {
        total: 0,
        correct: 0,
        timeSpentSec: 0,
      };
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
    setAnswerAttempts((prev) => prev.filter((r) => r.questionId !== qId));

    if (existingRec) {
      setStats((prev) => {
        const q = allQuestions.find((item) => item.id === qId);
        const catKey = q?.category || "verbal";
        const prevCat = prev.categoryStats[catKey] || {
          total: 0,
          correct: 0,
          timeSpentSec: 0,
        };
        const newCat = {
          total: Math.max(0, prevCat.total - 1),
          correct: Math.max(
            0,
            prevCat.correct - (existingRec.isCorrect ? 1 : 0),
          ),
          timeSpentSec: Math.max(
            0,
            prevCat.timeSpentSec - existingRec.timeSpentSec,
          ),
        };

        return {
          ...prev,
          totalAnswered: Math.max(0, prev.totalAnswered - 1),
          totalCorrect: Math.max(
            0,
            prev.totalCorrect - (existingRec.isCorrect ? 1 : 0),
          ),
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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSaveNote = (id: string, note: string) => {
    setNotes((prev) => ({ ...prev, [id]: note }));
  };

  // AI 变式题库：保存 / 删除 / 清空 / 记录作答
  const handleSaveVariant = (variant: any, source: Question) => {
    const id = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newQuestion: AIQuestion = {
      id,
      category: (variant.category as AIQuestion["category"]) || source.category,
      categoryName: source.categoryName,
      subCategory: variant.subCategory || source.subCategory,
      difficulty:
        (variant.difficulty as AIQuestion["difficulty"]) || source.difficulty,
      stem: String(variant.stem || ""),
      options: Array.isArray(variant.options)
        ? variant.options
        : source.options,
      correctAnswer: variant.correctAnswer,
      explanation: variant.explanation || "",
      chart: variant.chart,
      stemFigures: variant.stemFigures,
      sourceQuestionId: source.id,
      sourceQuestionStem: source.stem,
      createdAt: new Date().toISOString(),
    };
    setAiQuestions((prev) => [newQuestion, ...prev.filter((q) => q.id !== id)]);
  };

  const handleDeleteAIQuestion = (id: string) => {
    setAiQuestions((prev) => prev.filter((q) => q.id !== id));
    setAiAnswerRecords((prev) => prev.filter((r) => r.questionId !== id));
  };

  const handleClearAIBank = () => {
    setAiQuestions([]);
    setAiAnswerRecords([]);
  };

  const handleRecordAIAnswer = (record: UserAnswerRecord) => {
    setAiAnswerRecords((prev) => {
      const filtered = prev.filter((r) => r.questionId !== record.questionId);
      return [record, ...filtered];
    });
  };

  // Open AI Modal
  const handleOpenAI = (
    tab: "explain" | "graphic" | "variant" | "chat",
    question?: Question,
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
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    localStorage.removeItem(NOTES_STORAGE_KEY);

    // Reset In-Memory React State immediately
    setStats(INITIAL_STATS);
    setAnswerAttempts([]);
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
        aiBankCount={aiQuestions.length}
        onOpenAIChat={() => handleOpenAI("chat")}
        onResetStats={() => setIsResetModalOpen(true)}
        reminderConfig={reminderConfig}
        onOpenReminderModal={() => setIsReminderSettingsOpen(true)}
      />

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "practice" && (
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

        {activeTab === "graphic-lab" && (
          <PatternLab
            onOpenAI={handleOpenAI}
            onRecordAnswer={handleRecordAnswer}
            onAddMistake={handleAddMistake}
            stats={stats}
          />
        )}

        {activeTab === "exam" && (
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

        {activeTab === "mistakes" && (
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

        {activeTab === "ai-bank" && (
          <AIVariantBank
            questions={aiQuestions}
            answerRecords={aiAnswerRecords}
            onRecordAnswer={handleRecordAIAnswer}
            onDeleteQuestion={handleDeleteAIQuestion}
            onClearAll={handleClearAIBank}
            onOpenAI={handleOpenAI}
          />
        )}

        {activeTab === "cheatsheet" && <FormulaGuide />}

        {activeTab === "analytics" && (
          <AnalyticsView
            stats={stats}
            answerRecords={answerRecords}
            answerAttempts={answerAttempts}
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
        selectedOption={
          aiModal.question
            ? answeredMap[aiModal.question.id] ||
              aiAnswerRecords.find(
                (record) => record.questionId === aiModal.question?.id,
              )?.userAnswer
            : undefined
        }
        userNote={aiModal.question ? notes[aiModal.question.id] : undefined}
        onSaveVariant={handleSaveVariant}
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

      {/* Footer：练习手账的落款 */}
      <footer className="border-t border-dashed border-[#cdbb97] bg-[var(--card)] py-7 mt-12 text-xs text-[color:var(--ink-soft)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <strong className="font-display text-base text-[color:var(--ink)]">上岸测评</strong>
            <span className="ml-2">© 2026 · 把每次练习，写成上岸进度</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[#8c7e6d]">
            <span>言语理解</span>
            <span aria-hidden="true">×</span>
            <span>资料分析</span>
            <span aria-hidden="true">×</span>
            <span>复杂图推</span>
            <span className="text-[color:var(--ink-accent)]">AI 导学</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
