import React, { useEffect, useRef, useState } from "react";
import { AIQuestion, UserAnswerRecord } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { VariantChart } from "./VariantChart";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
  Clock,
  MessageSquare,
} from "lucide-react";

interface AIQuestionCardProps {
  question: AIQuestion;
  record?: UserAnswerRecord;
  onSelectOption: (key: string, timeSpentSec: number) => void;
  onDelete?: (id: string) => void;
  onOpenAI: () => void;
  index?: number;
  total?: number;
}

export const AIQuestionCard: React.FC<AIQuestionCardProps> = ({
  question,
  record,
  onSelectOption,
  onDelete,
  onOpenAI,
  index,
  total,
}) => {
  const [draft, setDraft] = useState<string | null>(record?.userAnswer ?? null);
  const [submitted, setSubmitted] = useState<boolean>(!!record);
  const [showExplanation, setShowExplanation] = useState<boolean>(!!record);
  const startTimeRef = useRef<number>(Date.now());
  const [localTimeSec, setLocalTimeSec] = useState<number | null>(null);

  useEffect(() => {
    setDraft(record?.userAnswer ?? null);
    setSubmitted(!!record);
    setShowExplanation(!!record);
    startTimeRef.current = Date.now();
    setLocalTimeSec(null);
  }, [question.id, record?.userAnswer]);

  const handleSelect = (key: string) => {
    if (submitted) return;
    const timeSpentSec = Math.max(
      1,
      Math.round((Date.now() - startTimeRef.current) / 1000),
    );
    setDraft(key);
    setSubmitted(true);
    setShowExplanation(true);
    setLocalTimeSec(timeSpentSec);
    onSelectOption(key, timeSpentSec);
  };

  const handleReset = () => {
    setDraft(null);
    setSubmitted(false);
    setShowExplanation(false);
    startTimeRef.current = Date.now();
    setLocalTimeSec(null);
  };

  const activeOption = submitted ? draft : null;
  const isCorrect = activeOption === question.correctAnswer;
  const displayTimeSec = record?.timeSpentSec ?? localTimeSec;

  return (
    <div className="bg-[#fdfbf7] rounded-2xl border border-[#e3d9c4] shadow-[0_2px_10px_rgba(65,45,20,0.04)] overflow-hidden">
      {/* Header */}
      <div className="bg-[#f7f2e7] border-b border-[#e3d9c4] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {index !== undefined && total !== undefined && (
            <span className="font-bold text-[#26201a] text-xs sm:text-sm">
              第 {index + 1} / {total} 题
            </span>
          )}
          <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold border bg-[#fef7ea] text-[#854d0e] border-[#ebdcb9]">
            AI 变式 · {question.categoryName}
          </span>
          <span className="text-xs text-[#786c5e] font-medium hidden sm:inline-block">
            · {question.subCategory}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {displayTimeSec != null && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#786c5e] bg-[#f8f3e8] border border-[#ded3bd] px-2 py-1 rounded-lg">
              <Clock className="w-3 h-3 text-[#6b3b1f]" />
              <span>本题用时 {displayTimeSec}s</span>
            </span>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(question.id)}
              className="p-1.5 rounded-lg border border-[#ded4bf] bg-[#faf6ee] text-[#8c7e6d] hover:text-[#b91c1c] hover:border-[#fca5a5] transition-colors cursor-pointer"
              title="从 AI 题库删除此题"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {question.sourceQuestionStem && (
          <div className="text-[11px] text-[#8c7e6d] bg-[#f8f3e8] border border-[#e8ded0] rounded-lg px-3 py-2">
            <Sparkles className="w-3 h-3 inline text-[#b45309] mr-1" />
            母题来源：{question.sourceQuestionStem.slice(0, 80)}
            {question.sourceQuestionStem.length > 80 ? "…" : ""}
          </div>
        )}

        <div className="text-[#26201a] font-medium text-sm sm:text-base leading-relaxed tracking-wide whitespace-pre-wrap">
          {question.stem}
        </div>

        {question.stemFigures && question.stemFigures.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {question.stemFigures.map((fig, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-[#ded3bd] p-2 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: fig.svg }}
                />
                <span className="text-[10px] text-[#8c7e6d]">
                  {fig.label || `图${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {question.chart && <VariantChart chart={question.chart} />}

        <div
          className={
            question.options.some((opt) => opt.svg)
              ? "grid grid-cols-2 lg:grid-cols-4 gap-2 pt-1"
              : "space-y-2.5 pt-1"
          }
        >
          {question.options.map((opt) => {
            const isSelected = submitted && draft === opt.key;
            const isCorrectOpt = question.correctAnswer === opt.key;

            let btnStyle =
              "bg-[#fffdfa] border-[#ded3bd] hover:border-[#b45309] text-[#26201a]";
            if (submitted) {
              if (isCorrectOpt) {
                btnStyle =
                  "bg-[#edf7ee] border-[#4e9658] text-[#14532d] font-semibold";
              } else if (isSelected && !isCorrectOpt) {
                btnStyle = "bg-[#fef2f0] border-[#c2410c] text-[#991b1b]";
              }
            } else if (draft === opt.key) {
              btnStyle =
                "bg-[#fef7eb] border-[#b45309] text-[#26201a] font-semibold ring-1 ring-[#b45309]";
            }

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelect(opt.key)}
                className={`w-full text-left p-3 rounded-lg border flex ${
                  opt.svg
                    ? "flex-col items-stretch gap-2"
                    : "items-start gap-2.5"
                } text-xs transition-all cursor-pointer ${btnStyle}`}
              >
                <span className="w-5 h-5 rounded-full bg-[#f3ead7] flex items-center justify-center font-bold text-[#4a3e31] shrink-0">
                  {opt.key}
                </span>
                {opt.svg ? (
                  <span className="w-full flex flex-col gap-1 min-w-0">
                    <span
                      className="w-full min-h-20 max-h-32 flex items-center justify-center bg-white rounded-md border border-[#e8ded0] p-1"
                      dangerouslySetInnerHTML={{ __html: opt.svg }}
                    />
                    {opt.content && (
                      <span className="text-[11px] text-[#786c5e] leading-snug">
                        {opt.content}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="flex-1">{opt.content}</span>
                )}
                {submitted && isCorrectOpt && (
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                )}
                {submitted && isSelected && !isCorrectOpt && (
                  <XCircle className="w-4 h-4 text-[#b91c1c] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 p-4 sm:p-5 bg-[#f7f2e5] rounded-xl border border-[#dfd5bf] space-y-3 text-xs sm:text-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#dfd5bf]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#26201a]">标准答案：</span>
                <span className="text-base font-extrabold text-[#1b5e20]">
                  {question.correctAnswer}
                </span>
                {activeOption && (
                  <span
                    className={`text-xs ml-2 font-medium ${isCorrect ? "text-[#1b5e20]" : "text-[#b91c1c]"}`}
                  >
                    ({isCorrect ? "回答正确 ✓" : `你的答案是 ${activeOption} ✕`}
                    )
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowExplanation((prev) => !prev)}
                className="text-xs font-semibold text-[#6e6153] hover:text-[#26201a] cursor-pointer bg-[#faf5ec] px-2.5 py-1 rounded-lg border border-[#e3d8c2]"
              >
                {showExplanation ? "收起题解" : "查看题解"}
              </button>
            </div>

            {showExplanation && (
              <div className="space-y-1.5">
                <div className="font-semibold text-[#26201a]">
                  【解题逻辑剖析】：
                </div>
                <MarkdownRenderer
                  content={question.explanation || "暂无解析"}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={onOpenAI}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fef7ea] hover:bg-[#faeed6] text-[#854d0e] border border-[#e8d5b0] rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b45309]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#b45309]" />
                <span>问 AI</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#faf5ec] hover:bg-[#f0e7d6] text-[#786c5e] hover:text-[#26201a] border border-[#ded2bd] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="清除本题作答，重新独立思考"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重新作答</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
