import type React from "react";
import { useEffect, useState } from "react";
import type { AnswerAttempt, StudyStats, UserAnswerRecord } from "../types";
import type { SubCategoryStat } from "../data/analytics";
import { studyRhythm } from "../data/analytics";
import { allQuestions } from "../data/allQuestions";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Sparkles, Stethoscope, X, Loader2 } from "lucide-react";

/** 学情看板入口（analytics 模式）所需的看板全维度数据，与 AnalyticsView 同口径 */
export interface AnalyticsDiagnoseInput {
  radar: {
    verbal: number | null;
    data: number | null;
    graphic: number | null;
    advancedGraphic: number | null;
    hard: number | null;
  };
  categoryStats: {
    key: string;
    name: string;
    totalAnswered: number;
    correctCount: number;
    accuracy: number;
    avgTimeSec: number;
    bankTotal: number;
  }[];
  subStats: Record<"verbal" | "data" | "graphic", SubCategoryStat[]>;
  timeEfficiency: { fastCount: number; normalCount: number; slowCount: number };
  trend: {
    recent: { count: number; acc: number } | null;
    before: { count: number; acc: number } | null;
  };
  streakDays: number;
  coveragePct: number;
}

/**
 * 真实 AI 学情诊断弹窗（server /api/ai/diagnose）。
 * - mistakes 模式（错题本入口）：错题归因 + 提分处方
 * - analytics 模式（学情看板入口）：注入看板全维度数据的全面诊断分析
 */
interface AIDiagnoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakeIds: string[];
  answerRecords: UserAnswerRecord[];
  stats: StudyStats;
  mode?: "mistakes" | "analytics";
  /** analytics 模式：全量作答轨迹（驱动学习节律） */
  answerAttempts?: AnswerAttempt[];
  /** analytics 模式：看板全维度数据（与 AnalyticsView 同口径） */
  analyticsData?: AnalyticsDiagnoseInput;
}

export const AIDiagnoseModal: React.FC<AIDiagnoseModalProps> = ({
  isOpen,
  onClose,
  mistakeIds,
  answerRecords,
  stats,
  mode = "mistakes",
  answerAttempts,
  analyticsData,
}) => {
  const isAnalytics = mode === "analytics";
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [diagnoseError, setDiagnoseError] = useState<string | null>(null);

  const fetchDiagnosis = async () => {
    setLoadingDiagnosis(true);
    setDiagnoseError(null);
    setDiagnosis(null);
    try {
      // 按错题加入顺序（新→旧，mistakeIds 头部为最新）取数：
      // 诊断应代表近期学情，而非题库顺序的任意子集（审计 D-2）
      const mistakeSummary = mistakeIds
        .map((id) => allQuestions.find((q) => q.id === id))
        .filter((q) => q !== undefined)
        .map((q) => ({
          subCategory: q.subCategory,
          category: q.categoryName,
          userAnswer:
            answerRecords.find((r) => r.questionId === q.id)?.userAnswer ||
            "未作答",
          correctAnswer: q.correctAnswer,
          timeSpentSec: answerRecords.find((r) => r.questionId === q.id)
            ?.timeSpentSec,
        }));

      const catAccuracy = (key: string) => {
        const cs = stats.categoryStats[key];
        if (!cs || cs.total === 0) return 0;
        return Math.round((cs.correct / cs.total) * 100);
      };

      const qById = new Map(allQuestions.map((q) => [q.id, q]));
      const catTime = (key: string) => {
        const recs = answerRecords.filter(
          (r) => qById.get(r.questionId)?.category === key,
        );
        if (recs.length === 0) return 0;
        return Math.round(
          recs.reduce((acc, r) => acc + (r.timeSpentSec || 0), 0) / recs.length,
        );
      };

      const timedRecords = answerRecords.filter(
        (r) => (r.timeSpentSec || 0) > 0,
      );
      const avgTimeSec =
        timedRecords.length > 0
          ? Math.round(
              timedRecords.reduce((acc, r) => acc + r.timeSpentSec, 0) /
                timedRecords.length,
            )
          : 0;
      const fastAnsweredCount = answerRecords.filter(
        (r) => (r.timeSpentSec || 0) > 0 && r.timeSpentSec <= 30,
      ).length;
      const slowAnsweredCount = answerRecords.filter(
        (r) => (r.timeSpentSec || 0) > 60,
      ).length;

      const statsPayload = {
        totalAnswered: stats.totalAnswered,
        accuracy:
          stats.totalAnswered > 0
            ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
            : 0,
        verbalAccuracy: catAccuracy("verbal"),
        dataAccuracy: catAccuracy("data"),
        graphicAccuracy: catAccuracy("graphic"),
        averageTimeSec: avgTimeSec,
        verbalAvgTimeSec: catTime("verbal"),
        dataAvgTimeSec: catTime("data"),
        graphicAvgTimeSec: catTime("graphic"),
        fastAnsweredCount,
        slowAnsweredCount,
      };

      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isAnalytics && analyticsData && answerAttempts
            ? {
                mistakeSummary,
                stats: statsPayload,
                mode: "analytics",
                analytics: {
                  radar: analyticsData.radar,
                  categoryStats: analyticsData.categoryStats,
                  subStats: analyticsData.subStats,
                  timeEfficiency: analyticsData.timeEfficiency,
                  trend: analyticsData.trend,
                  rhythm: studyRhythm(answerAttempts),
                  streakDays: analyticsData.streakDays,
                  coveragePct: analyticsData.coveragePct,
                },
              }
            : { mistakeSummary, stats: statsPayload },
        ),
      });
      const data = await res.json();
      if (data.diagnosis) {
        setDiagnosis(data.diagnosis);
      } else {
        setDiagnoseError(data.error || "诊断报告生成失败，请稍后重试");
      }
    } catch (e: any) {
      setDiagnoseError(`请求失败: ${e.message}`);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  useEffect(() => {
    if (isOpen && !diagnosis && !loadingDiagnosis) {
      fetchDiagnosis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#26201a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
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
                {isAnalytics
                  ? "AI 全面学情诊断分析"
                  : "AI 学情深度诊断与提分处方"}
              </h3>
              <p className="text-xs text-[#ded3be]">
                {isAnalytics
                  ? `能力雷达 · 分考点掌握 · 用时效率 · 趋势与学习节律 · ${mistakeIds.length} 道错题归因`
                  : `基于你的 ${answerRecords.length} 题作答记录与 ${mistakeIds.length} 道错题`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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
              <p className="text-xs font-medium">
                {isAnalytics
                  ? "AI 正在综合剖析你的能力雷达、考点掌握、用时效率与学习节律..."
                  : "AI 正在多维剖析你的错题规律与思维误区..."}
              </p>
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
  );
};
