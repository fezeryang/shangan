import React, { useState, useEffect, useRef } from 'react';
import { Question, StudyStats, UserAnswerRecord } from '../types';
import { QuestionKnowledgeModal } from './QuestionKnowledgeModal';
import {
  Sparkles,
  Layers,
  Repeat,
  CheckCircle2,
  XCircle,
  Edit3,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Star,
  RotateCcw,
  CheckCheck,
  Network,
  Clock,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOption?: string;
  onSelectOption: (key: string, timeSpentSec?: number) => void;
  isAnswered: boolean;
  onOpenAI: (tab: 'explain' | 'graphic' | 'variant' | 'chat') => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
  userNote?: string;
  onSaveNote?: (id: string, note: string) => void;
  onResetAnswer?: (questionId: string) => void;
  showExplanationDirectly?: boolean;
  instantSubmitMode?: boolean;
  questionIndex?: number;
  totalQuestions?: number;
  stats?: StudyStats;
  answerRecords?: UserAnswerRecord[];
  onNavigateToSubCategory?: (category: string, subCategory: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  isAnswered,
  onOpenAI,
  onToggleFavorite,
  isFavorite = false,
  userNote = '',
  onSaveNote,
  onResetAnswer,
  showExplanationDirectly = false,
  instantSubmitMode = false,
  questionIndex,
  totalQuestions,
  stats,
  answerRecords,
  onNavigateToSubCategory,
}) => {
  // Draft option selected by user before final submission
  const [draftOption, setDraftOption] = useState<string | null>(selectedOption || null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(isAnswered || showExplanationDirectly);
  const [showExplanation, setShowExplanation] = useState<boolean>(showExplanationDirectly || isAnswered);
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>(userNote);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState<boolean>(false);

  // 真实单题用时：从题目首次展示到提交作答
  const startTimeRef = useRef<number>(Date.now());
  const [submittedTimeSec, setSubmittedTimeSec] = useState<number | null>(null);

  // Sync draft when selectedOption changes from outside
  useEffect(() => {
    setDraftOption(selectedOption || null);
    setHasSubmitted(isAnswered || showExplanationDirectly);
    setShowExplanation(showExplanationDirectly || isAnswered);
  }, [selectedOption, isAnswered, showExplanationDirectly, question.id]);

  useEffect(() => {
    setNoteText(userNote);
  }, [userNote]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setSubmittedTimeSec(null);
  }, [question.id]);

  // Handle clicking an option
  const handleOptionClick = (key: string) => {
    if (hasSubmitted) return; // Prevent changing after submit unless reset

    setDraftOption(key);
    if (instantSubmitMode) {
      const timeSpentSec = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      setSubmittedTimeSec(timeSpentSec);
      onSelectOption(key, timeSpentSec);
      setHasSubmitted(true);
      setShowExplanation(true);
    }
  };

  // Explicit confirmation to submit and grade
  const handleConfirmSubmit = () => {
    if (!draftOption) return;
    const timeSpentSec = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    setSubmittedTimeSec(timeSpentSec);
    onSelectOption(draftOption, timeSpentSec);
    setHasSubmitted(true);
    setShowExplanation(true);
  };

  // Reset to re-attempt question blindly
  const handleResetAttempt = () => {
    setDraftOption(null);
    setHasSubmitted(false);
    setShowExplanation(false);
    startTimeRef.current = Date.now();
    setSubmittedTimeSec(null);
    if (onResetAnswer) {
      onResetAnswer(question.id);
    }
  };

  // Keyboard shortcut listener for A, B, C, D and Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key) && !hasSubmitted) {
        handleOptionClick(key);
      } else if (e.key === 'Enter' && draftOption && !hasSubmitted) {
        handleConfirmSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draftOption, hasSubmitted, instantSubmitMode]);

  const activeOption = draftOption || selectedOption;
  const isCorrect = activeOption === question.correctAnswer;
  const recordTimeSec = answerRecords?.find((r) => r.questionId === question.id)?.timeSpentSec;
  const displayTimeSec = recordTimeSec ?? submittedTimeSec;

  const difficultyStars =
    question.difficulty === 'hard' ? 5 : question.difficulty === 'medium' ? 4 : 3;

  const handleSaveNote = () => {
    if (onSaveNote) {
      onSaveNote(question.id, noteText);
    }
    setIsEditingNote(false);
  };

  return (
    <div className="bg-[#fdfbf7] rounded-2xl border border-[#e3d9c4] shadow-[0_2px_10px_rgba(65,45,20,0.04)] overflow-hidden transition-all">
      {/* Question Header & Meta Bar */}
      <div className="bg-[#f7f2e7] border-b border-[#e3d9c4] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {questionIndex !== undefined && totalQuestions !== undefined && (
            <span className="font-bold text-[#26201a] text-xs sm:text-sm">
              第 {questionIndex + 1} / {totalQuestions} 题
            </span>
          )}
          <span
            className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${
              question.category === 'verbal'
                ? 'bg-[#fcf5e5] text-[#854d0e] border-[#ebdcb9]'
                : question.category === 'data'
                ? 'bg-[#fff4ea] text-[#9a3412] border-[#f4d7b8]'
                : 'bg-[#f5ede3] text-[#6b3b1f] border-[#decfbe]'
            }`}
          >
            {question.categoryName}
          </span>
          <span className="text-xs text-[#786c5e] font-medium hidden sm:inline-block">
            · {question.subCategory}
          </span>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Difficulty Rating */}
          <div className="flex items-center gap-0.5 text-[#b45309]" title={`难度 ${difficultyStars} 星`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < difficultyStars ? 'fill-[#b45309] text-[#b45309]' : 'text-[#ded4c1]'
                }`}
              />
            ))}
          </div>

          {/* Knowledge Graph Trigger Button */}
          <button
            onClick={() => setIsKnowledgeModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border bg-[#faf5ec] hover:bg-[#f2e7d3] text-[#854d0e] border-[#e8d7b7] text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="查看本题关联的考点知识图谱"
          >
            <Network className="w-3.5 h-3.5 text-[#b45309]" />
            <span>关联考点图谱</span>
          </button>

          {/* Favorite Toggle */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(question.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-[#fef8ea] border-[#e8ce8a] text-[#b45309]'
                  : 'bg-[#faf6ee] border-[#ded4bf] text-[#8c7e6d] hover:text-[#26201a] hover:bg-[#f3ebd9]'
              }`}
              title={isFavorite ? '已收藏此题' : '收藏此题'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#b45309]' : ''}`} />
            </button>
          )}

          {/* Note Button */}
          <button
            onClick={() => setIsEditingNote(!isEditingNote)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              userNote
                ? 'bg-[#fef6ea] border-[#e8ce8a] text-[#b45309]'
                : 'bg-[#faf6ee] border-[#ded4bf] text-[#8c7e6d] hover:text-[#26201a] hover:bg-[#f3ebd9]'
            }`}
            title="添加题目笔记"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Editor Bar (if expanded) */}
      {isEditingNote && (
        <div className="bg-[#fcf8ef] p-3.5 border-b border-[#e3d9c4] animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-[#854d0e] mb-1.5">📝 个人专属做题笔记与复盘记录：</div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={2}
            placeholder="记录你的错因反思、做题直觉或秒杀口诀..."
            className="w-full text-xs p-2.5 bg-[#fffdfa] border border-[#dccfb7] rounded-lg focus:outline-[#b45309] text-[#26201a]"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setIsEditingNote(false)}
              className="px-2.5 py-1 text-xs text-[#786c5e] hover:bg-[#f0e8d8] rounded-md cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleSaveNote}
              className="px-3 py-1 bg-[#b45309] hover:bg-[#9a3412] text-white text-xs font-medium rounded-md cursor-pointer shadow-xs"
            >
              保存笔记
            </button>
          </div>
        </div>
      )}

      {/* Main Question Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Stem Text */}
        <div className="text-[#26201a] font-medium text-sm sm:text-base leading-relaxed tracking-wide whitespace-pre-wrap">
          {question.stem}
        </div>

        {/* 题面配图（PDF 原题图表/图形，选项按图中从上到下对应 A、B、C…） */}
        {question.stemImages && question.stemImages.length > 0 && (
          <div className="space-y-3">
            {question.stemImages.map((src) => (
              <div
                key={src}
                className="inline-block bg-white rounded-lg border border-[#e3d9c4] p-2 shadow-xs max-w-full"
              >
                <img
                  src={src}
                  alt="题目图表"
                  className="max-w-full max-h-[420px] object-contain select-none"
                  draggable={false}
                />
              </div>
            ))}
            {question.category === 'graphic' && (
              <p className="text-xs text-[#8c7e6d]">
                💡 图形题选项从上往下数，依次对应 A、B、C、D、E。
              </p>
            )}
          </div>
        )}

        {/* Options */}
        <div className="space-y-2.5 pt-2">
            {question.options.map((opt) => {
              const isSelected = activeOption === opt.key;
              const isCorrectOpt = question.correctAnswer === opt.key;

              let btnStyle =
                'bg-[#faf7f0] border-[#ded4bf] hover:border-[#b45309] hover:bg-[#f6efe2] text-[#26201a]';

              if (hasSubmitted) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-[#edf6ee] border-[#4e9658] text-[#14532d] ring-1 ring-[#4e9658] font-semibold';
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = 'bg-[#fef2f0] border-[#c2410c] text-[#991b1b] ring-1 ring-[#c2410c]';
                } else {
                  btnStyle = 'bg-[#fcfaf5] border-[#e7dece] text-[#968877] opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-[#fef7eb] border-[#b45309] text-[#26201a] ring-2 ring-[#b45309]/40 font-semibold shadow-xs';
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleOptionClick(opt.key)}
                  disabled={hasSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer shadow-2xs ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        hasSubmitted && isCorrectOpt
                          ? 'bg-[#24683a] text-white'
                          : hasSubmitted && isSelected && !isCorrectOpt
                          ? 'bg-[#c2410c] text-white'
                          : isSelected
                          ? 'bg-[#b45309] text-white'
                          : 'bg-[#ede5d4] text-[#4a3e31]'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="leading-relaxed">{opt.content}</span>
                  </div>

                  {hasSubmitted && (
                    <div className="shrink-0">
                      {isCorrectOpt && (
                        <span className="flex items-center gap-1 text-[#15803d] font-bold text-xs bg-[#dcfce7] px-2 py-0.5 rounded-md border border-[#86efac]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 正确
                        </span>
                      )}
                      {isSelected && !isCorrectOpt && (
                        <span className="flex items-center gap-1 text-[#b91c1c] font-bold text-xs bg-[#fee2e2] px-2 py-0.5 rounded-md border border-[#fca5a5]">
                          <XCircle className="w-3.5 h-3.5" /> 你的选择
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
        </div>

        {/* Action Bar: Submit & Check / Retry */}
        {!hasSubmitted ? (
          <div className="pt-3 border-t border-[#e8dfcb] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#786c5e]">
              {draftOption ? (
                <span>已选择 <strong>{draftOption}</strong> 选项，确认无误后点击右侧提交</span>
              ) : (
                <span>请先选择你的答案（支持键盘按键 A / B / C / D）</span>
              )}
            </span>

            <button
              onClick={handleConfirmSubmit}
              disabled={!draftOption}
              className="px-5 py-2 bg-[#b45309] hover:bg-[#9a3412] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              <span>确认作答 · 核对答案</span>
            </button>
          </div>
        ) : (
          <div className="pt-3 border-t border-[#e8dfcb] flex flex-wrap items-center justify-between gap-2">
            {/* AI Helper Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenAI('explain')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fef7ea] hover:bg-[#faeed6] text-[#854d0e] border border-[#e8d5b0] rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
                <span>AI 思维链解析</span>
              </button>

              {question.category === 'graphic' && (
                <button
                  onClick={() => onOpenAI('graphic')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f6efe6] hover:bg-[#ede3d5] text-[#6b3b1f] border border-[#ded0be] rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#6b3b1f]" />
                  <span>图推规律透析</span>
                </button>
              )}

              <button
                onClick={() => onOpenAI('variant')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5efe2] hover:bg-[#ece2d0] text-[#5c4e3f] border border-[#ded2bd] rounded-lg text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                <Repeat className="w-3.5 h-3.5 text-[#786c5e]" />
                <span>举一反三变式</span>
              </button>

              {/* Knowledge Graph Button */}
              <button
                onClick={() => setIsKnowledgeModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fef8eb] hover:bg-[#faeed6] text-[#854d0e] border border-[#e8ce8a] rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Network className="w-3.5 h-3.5 text-[#b45309]" />
                <span>关联考点图谱</span>
              </button>

              <button
                onClick={handleResetAttempt}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#faf5ec] hover:bg-[#f0e7d6] text-[#786c5e] hover:text-[#26201a] border border-[#ded2bd] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="清除已答状态，重新独立思考作答"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重新作答</span>
              </button>

              {displayTimeSec != null && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] text-[#786c5e] bg-[#f8f3e8] border border-[#ded3bd] px-2 py-1 rounded-lg"
                  title="本题实际作答用时"
                >
                  <Clock className="w-3 h-3 text-[#6b3b1f]" />
                  <span>本题用时 {displayTimeSec}s</span>
                </span>
              )}
            </div>

            {/* Toggle Official Solution */}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 text-xs font-semibold text-[#6e6153] hover:text-[#26201a] cursor-pointer bg-[#f7f2e5] px-3 py-1.5 rounded-lg border border-[#e3d8c2]"
            >
              <span>{showExplanation ? '收起标准题解' : '查看标准题解'}</span>
              {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Official Detailed Explanation Box */}
        {hasSubmitted && showExplanation && (
          <div className="mt-4 p-4 sm:p-5 bg-[#f7f2e5] rounded-xl border border-[#dfd5bf] space-y-3 text-xs sm:text-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#dfd5bf]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#26201a]">标准答案：</span>
                <span className="text-base font-extrabold text-[#1b5e20]">{question.correctAnswer}</span>
                {activeOption && (
                  <span className={`text-xs ml-2 font-medium ${isCorrect ? 'text-[#1b5e20]' : 'text-[#b91c1c]'}`}>
                    ({isCorrect ? '回答正确 ✓' : `你的答案是 ${activeOption} ✕`})
                  </span>
                )}
              </div>
            </div>

            {/* Step-by-step logic breakdown */}
            <div className="space-y-1.5">
              <div className="font-semibold text-[#26201a]">【解题逻辑剖析】：</div>
              <p className="text-[#4a3e31] leading-relaxed whitespace-pre-wrap">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Knowledge Graph Modal (考点图谱定位) */}
      <QuestionKnowledgeModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        question={question}
        stats={stats}
        answerRecords={answerRecords}
        onNavigateToSubCategory={onNavigateToSubCategory}
      />
    </div>
  );
};
