import React, { useState } from 'react';
import { Question, StudyStats, UserAnswerRecord } from '../types';
import { allQuestions } from '../data/allQuestions';
import { QuestionCard } from './QuestionCard';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  BookMarked,
  Sparkles,
  Trash2,
  CheckCircle2,
  Check,
  X,
  Loader2,
  Stethoscope,
} from 'lucide-react';

interface MistakeBookProps {
  mistakeIds: string[];
  onRemoveMistake: (id: string) => void;
  onClearAllMistakes: () => void;
  onOpenAI: (tab: 'explain' | 'graphic' | 'variant' | 'chat', q?: Question) => void;
  onRecordAnswer: (record: UserAnswerRecord) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  notes: Record<string, string>;
  onSaveNote: (id: string, note: string) => void;
  answeredMap: Record<string, string>;
  onResetAnswer?: (qId: string) => void;
  stats: StudyStats;
  answerRecords: UserAnswerRecord[];
  onNavigateToSubCategory?: (category: string, subCategory: string) => void;
}

export const MistakeBook: React.FC<MistakeBookProps> = ({
  mistakeIds,
  onRemoveMistake,
  onClearAllMistakes,
  onOpenAI,
  onRecordAnswer,
  favorites,
  onToggleFavorite,
  notes,
  onSaveNote,
  answeredMap,
  onResetAnswer,
  stats,
  answerRecords,
  onNavigateToSubCategory,
}) => {
  const [filterCat, setFilterCat] = useState<'all' | 'verbal' | 'data' | 'graphic'>('all');

  // AI Diagnosis State
  const [isDiagnoseOpen, setIsDiagnoseOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [diagnoseError, setDiagnoseError] = useState<string | null>(null);

  const mistakeQuestions = allQuestions.filter((q) => mistakeIds.includes(q.id));

  const filtered = mistakeQuestions.filter((q) => {
    if (filterCat !== 'all' && q.category !== filterCat) return false;
    return true;
  });

  const handleSelectOption = (question: Question, optionKey: string) => {
    const isCorrect = optionKey === question.correctAnswer;
    onRecordAnswer({
      questionId: question.id,
      userAnswer: optionKey,
      isCorrect,
      timeSpentSec: 30,
      answeredAt: new Date().toISOString(),
    });
  };

  const fetchDiagnosis = async () => {
    setLoadingDiagnosis(true);
    setDiagnoseError(null);
    setDiagnosis(null);
    try {
      const mistakeSummary = mistakeQuestions.map((q) => ({
        subCategory: q.subCategory,
        category: q.categoryName,
        userAnswer: answeredMap[q.id] || '未作答',
        correctAnswer: q.correctAnswer,
        patternRule: q.patternRule,
      }));

      const catAccuracy = (key: string) => {
        const cs = stats.categoryStats[key];
        if (!cs || cs.total === 0) return 0;
        return Math.round((cs.correct / cs.total) * 100);
      };

      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mistakeSummary,
          stats: {
            totalAnswered: stats.totalAnswered,
            accuracy:
              stats.totalAnswered > 0
                ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
                : 0,
            verbalAccuracy: catAccuracy('verbal'),
            dataAccuracy: catAccuracy('data'),
            graphicAccuracy: catAccuracy('graphic'),
          },
        }),
      });
      const data = await res.json();
      if (data.diagnosis) {
        setDiagnosis(data.diagnosis);
      } else {
        setDiagnoseError(data.error || '诊断报告生成失败，请稍后重试');
      }
    } catch (e: any) {
      setDiagnoseError(`请求失败: ${e.message}`);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  const handleOpenDiagnose = () => {
    setIsDiagnoseOpen(true);
    if (!diagnosis && !loadingDiagnosis) {
      fetchDiagnosis();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e3d9c4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#fee2e2] text-[#991b1b] rounded-xl border border-[#fecaca]">
              <BookMarked className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#26201a]">
              智能错题复盘与攻坚本
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#786c5e] mt-1">
            当前共有 <strong className="text-[#b91c1c] font-bold">{mistakeQuestions.length}</strong> 道错题。建议点击“重新作答”再次独立解题，答对后即可一键移出。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenDiagnose}
            disabled={mistakeQuestions.length === 0}
            title={
              mistakeQuestions.length === 0
                ? '暂无错题，无需诊断'
                : 'AI 深度分析错题规律，生成专属提分处方'
            }
            className="px-3.5 py-2 text-xs font-semibold text-[#854d0e] bg-[#fef7ea] hover:bg-[#faeed6] border border-[#ebdcb9] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>AI 学情诊断</span>
          </button>

          {mistakeQuestions.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('确定要清空所有错题记录吗？')) {
                  onClearAllMistakes();
                }
              }}
              className="px-3.5 py-2 text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空错题本</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
          {[
            { id: 'all', label: `全部错题 (${mistakeQuestions.length})` },
            { id: 'verbal', label: `言语理解 (${mistakeQuestions.filter((q) => q.category === 'verbal').length})` },
            { id: 'data', label: `资料分析 (${mistakeQuestions.filter((q) => q.category === 'data').length})` },
            { id: 'graphic', label: `图形推理 (${mistakeQuestions.filter((q) => q.category === 'graphic').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCat(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                filterCat === tab.id
                  ? 'bg-[#b45309] text-white shadow-2xs'
                  : 'bg-[#fdfbf7] border border-[#e3d9c4] text-[#6e6153] hover:bg-[#f6eee0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of Mistake Question Cards */}
      {filtered.length === 0 ? (
        <div className="bg-[#fdfbf7] rounded-2xl p-12 text-center border border-[#e3d9c4] space-y-3">
          <div className="w-12 h-12 bg-[#edf7ee] text-[#15803d] rounded-2xl mx-auto flex items-center justify-center border border-[#bbf7d0]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#26201a] text-base">当前分类暂无错题记录！</h3>
          <p className="text-xs text-[#786c5e]">继续保持良好的做题状态，做错的题目会自动收录至此。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((q, idx) => (
            <div key={q.id} className="relative">
              <QuestionCard
                question={q}
                selectedOption={answeredMap[q.id]}
                onSelectOption={(key) => handleSelectOption(q, key)}
                isAnswered={!!answeredMap[q.id]}
                onResetAnswer={onResetAnswer}
                onOpenAI={(tab) => onOpenAI(tab, q)}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(q.id)}
                userNote={notes[q.id]}
                onSaveNote={onSaveNote}
                questionIndex={idx}
                totalQuestions={filtered.length}
                stats={stats}
                answerRecords={answerRecords}
                onNavigateToSubCategory={onNavigateToSubCategory}
              />

              {/* Mastered / Remove Action Button */}
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => onRemoveMistake(q.id)}
                  className="text-xs text-[#15803d] hover:text-[#14532d] bg-[#edf7ee] hover:bg-[#dcfce7] border border-[#bbf7d0] px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>已彻底掌握，移出本题</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Diagnosis Report Modal */}
      {isDiagnoseOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#26201a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsDiagnoseOpen(false)}
        >
          <div
            className="bg-[#fdfbf7] rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl border border-[#e3d9c4] overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#2c241d] px-5 py-4 text-[#faf6ee] flex items-center justify-between border-b border-[#4a3e31]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#b45309]/30 border border-[#b45309]/50 rounded-lg text-[#fed7aa]">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-display text-white">
                    AI 错题学情深度诊断与提分处方
                  </h3>
                  <p className="text-xs text-[#ded3be]">
                    基于你的 {stats.totalAnswered} 题作答记录与 {mistakeQuestions.length} 道错题
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDiagnoseOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-lg text-[#ded3be] hover:text-white cursor-pointer"
                aria-label="关闭诊断报告"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {loadingDiagnosis ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#786c5e]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#b45309]" />
                  <p className="text-xs font-medium">AI 正在多维剖析你的错题规律与思维误区...</p>
                </div>
              ) : diagnoseError ? (
                <div className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-xs text-[#991b1b] space-y-3">
                  <p>{diagnoseError}</p>
                  <button
                    onClick={fetchDiagnosis}
                    className="px-3 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" /> 重新诊断
                  </button>
                </div>
              ) : diagnosis ? (
                <div className="bg-[#f8f3e8] p-4 rounded-xl border border-[#e3d8c2]">
                  <MarkdownRenderer content={diagnosis} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
