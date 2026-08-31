import React, { useState } from 'react';
import { Question, UserAnswerRecord } from '../types';
import { allQuestions } from '../data/allQuestions';
import { QuestionCard } from './QuestionCard';
import {
  BookMarked,
  Sparkles,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Filter,
  Check,
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
}) => {
  const [filterCat, setFilterCat] = useState<'all' | 'verbal' | 'data' | 'graphic'>('all');
  const [redoOnly, setRedoOnly] = useState(false);

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
    if (isCorrect) {
      // If re-answered correctly, option to remove from mistake book
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

        {mistakeQuestions.length > 0 && (
          <div className="flex items-center gap-2">
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
          </div>
        )}
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
    </div>
  );
};
