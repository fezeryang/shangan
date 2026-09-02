import React, { useMemo, useState } from "react";
import { AIQuestion, UserAnswerRecord } from "../types";
import { AIQuestionCard } from "./AIQuestionCard";
import {
  Sparkles,
  Trash2,
  BookOpen,
  CheckCircle2,
  Clock,
  Library,
} from "lucide-react";

interface AIVariantBankProps {
  questions: AIQuestion[];
  answerRecords: UserAnswerRecord[];
  onRecordAnswer: (record: UserAnswerRecord) => void;
  onDeleteQuestion: (id: string) => void;
  onClearAll: () => void;
  onOpenAI: (
    tab: "explain" | "graphic" | "variant" | "chat",
    question?: AIQuestion,
  ) => void;
}

export const AIVariantBank: React.FC<AIVariantBankProps> = ({
  questions,
  answerRecords,
  onRecordAnswer,
  onDeleteQuestion,
  onClearAll,
  onOpenAI,
}) => {
  const [filterCat, setFilterCat] = useState<
    "all" | "verbal" | "data" | "graphic"
  >("all");

  const recordMap = useMemo(() => {
    const map: Record<string, UserAnswerRecord> = {};
    answerRecords.forEach((r) => {
      map[r.questionId] = r;
    });
    return map;
  }, [answerRecords]);

  const filtered = useMemo(
    () =>
      questions.filter((q) => filterCat === "all" || q.category === filterCat),
    [questions, filterCat],
  );

  const answeredCount = questions.filter((q) => recordMap[q.id]).length;
  const correctCount = questions.filter(
    (q) => recordMap[q.id]?.isCorrect,
  ).length;
  const accuracy =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const avgTimeSec =
    answerRecords.length > 0
      ? Math.round(
          answerRecords.reduce((acc, r) => acc + (r.timeSpentSec || 0), 0) /
            answerRecords.length,
        )
      : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e3d9c4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#fef7ea] text-[#b45309] rounded-xl border border-[#ebdcb9]">
              <Library className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#26201a]">
                AI 举一反三变式题库
              </h2>
              <p className="text-xs sm:text-sm text-[#786c5e] mt-1">
                独立于真题库的专属 AI 题库：在「题库精练 → AI 助手 →
                举一反三变式训练」生成后点击「保存到 AI
                题库」即可在此刷题与复盘。
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm("确定要清空所有 AI 变式题及作答记录吗？")) {
                onClearAll();
              }
            }}
            disabled={questions.length === 0}
            className="px-3.5 py-2 text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空 AI 题库</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#fdfbf7] p-4 rounded-2xl border border-[#e3d9c4] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium">
            <span>AI 题量</span>
            <BookOpen className="w-4 h-4 text-[#b45309]" />
          </div>
          <div className="text-2xl font-extrabold text-[#26201a] mt-1.5 font-display">
            {questions.length}{" "}
            <span className="text-xs font-normal text-[#8c7e6d]">道</span>
          </div>
        </div>

        <div className="bg-[#fdfbf7] p-4 rounded-2xl border border-[#e3d9c4] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium">
            <span>已练题数</span>
            <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
          </div>
          <div className="text-2xl font-extrabold text-[#15803d] mt-1.5 font-display">
            {answeredCount}{" "}
            <span className="text-xs font-normal text-[#8c7e6d]">道</span>
          </div>
        </div>

        <div className="bg-[#fdfbf7] p-4 rounded-2xl border border-[#e3d9c4] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium">
            <span>AI 题正确率</span>
            <Sparkles className="w-4 h-4 text-[#b45309]" />
          </div>
          <div className="text-2xl font-extrabold text-[#b45309] mt-1.5 font-display">
            {answeredCount > 0 ? `${accuracy}%` : "—"}
          </div>
        </div>

        <div className="bg-[#fdfbf7] p-4 rounded-2xl border border-[#e3d9c4] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium">
            <span>AI 题平均用时</span>
            <Clock className="w-4 h-4 text-[#6b3b1f]" />
          </div>
          <div className="text-2xl font-extrabold text-[#6b3b1f] mt-1.5 font-display">
            {avgTimeSec || "—"}{" "}
            <span className="text-xs font-normal text-[#8c7e6d]">秒</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs overflow-x-auto pb-1">
        {[
          { id: "all", label: `全部 (${questions.length})` },
          {
            id: "verbal",
            label: `言语理解 (${questions.filter((q) => q.category === "verbal").length})`,
          },
          {
            id: "data",
            label: `资料分析 (${questions.filter((q) => q.category === "data").length})`,
          },
          {
            id: "graphic",
            label: `图形推理 (${questions.filter((q) => q.category === "graphic").length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCat(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
              filterCat === tab.id
                ? "bg-[#b45309] text-white shadow-2xs"
                : "bg-[#fdfbf7] border border-[#e3d9c4] text-[#6e6153] hover:bg-[#f6eee0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Question List */}
      {filtered.length === 0 ? (
        <div className="bg-[#fdfbf7] rounded-2xl p-12 text-center border border-[#e3d9c4] space-y-3">
          <div className="w-12 h-12 bg-[#fef7ea] text-[#b45309] rounded-2xl mx-auto flex items-center justify-center border border-[#ebdcb9]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#26201a] text-base">
            AI 变式题库还是空的
          </h3>
          <p className="text-xs text-[#786c5e] max-w-md mx-auto leading-relaxed">
            打开任意真题的{" "}
            <strong>AI 智能思维导学助手 → 举一反三变式训练</strong>
            ，生成变式题后点击
            <strong>「保存到 AI 题库」</strong>，即可沉淀为你的专属 AI 题库。
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((q, idx) => (
            <AIQuestionCard
              key={q.id}
              question={q}
              record={recordMap[q.id]}
              onSelectOption={(key, timeSpentSec) =>
                onRecordAnswer({
                  questionId: q.id,
                  userAnswer: key,
                  isCorrect: key === q.correctAnswer,
                  timeSpentSec,
                  answeredAt: new Date().toISOString(),
                })
              }
              onDelete={onDeleteQuestion}
              onOpenAI={() => onOpenAI("chat", q)}
              index={idx}
              total={filtered.length}
            />
          ))}
        </div>
      )}
    </div>
  );
};
