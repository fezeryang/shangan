import type React from "react";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type {
  AnswerAttempt,
  Question,
  StudyStats,
  UserAnswerRecord,
} from "../types";
import { allQuestions } from "../data/allQuestions";
import {
  buildQuestionIndex,
  subCategoryStats,
  recentTrend,
} from "../data/analytics";
import { KnowledgeGraph } from "./KnowledgeGraph";
import { StudyScheduleHeatmap } from "./StudyScheduleHeatmap";
import { AIDiagnoseModal } from "./AIDiagnoseModal";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BarChart2,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  Flame,
  ChevronDown,
  BookOpen,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { DrawablyButton } from "drawably/react";

interface AnalyticsViewProps {
  stats: StudyStats;
  answerRecords: UserAnswerRecord[];
  /** 全量作答历史（含重做轨迹），驱动趋势与作息热力图 */
  answerAttempts: AnswerAttempt[];
  onSelectSubCategory?: (category: string, subCategory: string) => void;
}

const CATEGORIES = [
  { key: "verbal", name: "言语理解" },
  { key: "data", name: "资料分析" },
  { key: "graphic", name: "图形推理" },
] as const;

export const COLLAPSE_STORAGE_KEY = "shangan_analytics_collapse_v1";

/** 折叠条：全页统一的区块折叠头（aria-expanded + ChevronDown） */
const CollapseBar: React.FC<{
  title: React.ReactNode;
  hint?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}> = ({ title, hint, open, onToggle }) => (
  <div className="bg-[#fdfbf7] rounded-2xl border border-[#e3d9c4] shadow-2xs">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="w-full flex items-center justify-between gap-3 px-5 sm:px-6 py-4 text-left cursor-pointer hover:bg-[#faf5ea] transition-colors rounded-2xl"
    >
      <h3 className="font-bold text-[#26201a] text-sm sm:text-base flex items-center gap-2">
        {title}
      </h3>
      <span className="flex items-center gap-2.5 text-[11px] text-[#786c5e] font-normal">
        {hint}
        <ChevronDown
          className={`w-4 h-4 text-[#8c7e6d] shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </span>
    </button>
  </div>
);

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  stats,
  answerRecords,
  answerAttempts,
  onSelectSubCategory,
}) => {
  // 折叠状态（localStorage 持久化；未记录过的键按 defaultOpen 兜底）
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(COLLAPSE_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const toggleSection = (key: string) =>
    setCollapsed((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // 存储不可用时仅内存态生效
      }
      return next;
    });
  const isCollapsed = (key: string, defaultOpen: boolean) =>
    collapsed[key] ?? !defaultOpen;

  const [isDiagnoseOpen, setIsDiagnoseOpen] = useState(false);

  // ===== 统计派生（单次 useMemo + Map join，口径统一：每题最新一次作答） =====
  const qIndex = useMemo(() => buildQuestionIndex(), []);

  const d = useMemo(() => {
    const total = answerRecords.length;
    const correct = answerRecords.filter((r) => r.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timedRecords = answerRecords.filter((r) => r.timeSpentSec > 0);
    const averageTimeSec =
      timedRecords.length > 0
        ? Math.round(
            timedRecords.reduce((s, r) => s + r.timeSpentSec, 0) /
              timedRecords.length,
          )
        : 0;

    const categoryStats = CATEGORIES.map((c) => {
      const recs = answerRecords.filter(
        (r) => qIndex.get(r.questionId)?.category === c.key,
      );
      const correctCount = recs.filter((r) => r.isCorrect).length;
      const timed = recs.filter((r) => r.timeSpentSec > 0);
      return {
        key: c.key,
        name: c.name,
        totalAnswered: recs.length,
        correctCount,
        accuracy:
          recs.length > 0 ? Math.round((correctCount / recs.length) * 100) : 0,
        bankTotal: allQuestions.filter((q) => q.category === c.key).length,
        avgTimeSec:
          timed.length > 0
            ? Math.round(
                timed.reduce((s, r) => s + r.timeSpentSec, 0) / timed.length,
              )
            : 0,
      };
    });

    // 未练习维度返回 null（雷达不绘制 0 分误导）
    const accOf = (pred: (q: Question) => boolean): number | null => {
      const recs = answerRecords.filter((r) => {
        const q = qIndex.get(r.questionId);
        return q ? pred(q) : false;
      });
      if (recs.length === 0) return null;
      return Math.round(
        (recs.filter((r) => r.isCorrect).length / recs.length) * 100,
      );
    };

    return {
      total,
      correct,
      accuracy,
      averageTimeSec,
      categoryStats,
      fastCount: answerRecords.filter(
        (r) => r.timeSpentSec > 0 && r.timeSpentSec <= 30,
      ).length,
      normalCount: answerRecords.filter(
        (r) => r.timeSpentSec > 30 && r.timeSpentSec <= 60,
      ).length,
      slowCount: answerRecords.filter((r) => r.timeSpentSec > 60).length,
      subStats: {
        verbal: subCategoryStats("verbal", answerRecords, qIndex),
        data: subCategoryStats("data", answerRecords, qIndex),
        graphic: subCategoryStats("graphic", answerRecords, qIndex),
      },
      radar: {
        verbal: accOf((q) => q.category === "verbal"),
        data: accOf((q) => q.category === "data"),
        graphic: accOf((q) => q.category === "graphic"),
        advancedGraphic: accOf(
          (q) =>
            q.category === "graphic" &&
            [
              "重叠相消",
              "时针旋转",
              "数量规律",
              "黑白位运算",
              "位置移动",
            ].includes(q.subCategory),
        ),
        hard: accOf((q) => q.difficulty === "hard"),
      },
    };
  }, [answerRecords, qIndex]);

  // 近 7 天 vs 之前的真实趋势（attempts 驱动，两窗口都有数据才展示）
  const trend = useMemo(() => recentTrend(answerAttempts), [answerAttempts]);
  const trendDelta =
    trend.recent && trend.before ? trend.recent.acc - trend.before.acc : null;

  const radarData = [
    { subject: "言语理解", value: d.radar.verbal, benchmark: 80 },
    { subject: "资料分析", value: d.radar.data, benchmark: 80 },
    { subject: "图形推理", value: d.radar.graphic, benchmark: 80 },
    { subject: "图形规律进阶", value: d.radar.advancedGraphic, benchmark: 80 },
    { subject: "难题正确率", value: d.radar.hard, benchmark: 80 },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // 空态：无作答记录时整页显示引导，不渲染 0 分图表
  if (answerRecords.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#fdfbf7] rounded-2xl p-10 sm:p-16 border border-[#e3d9c4] shadow-2xs text-center space-y-4">
          <div className="w-14 h-14 mx-auto bg-[#fef7ea] text-[#b45309] rounded-2xl flex items-center justify-center border border-[#ebdcb9]">
            <BarChart2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#26201a]">
            学情看板等待你的第一份作答数据
          </h2>
          <p className="text-xs sm:text-sm text-[#786c5e] max-w-md mx-auto leading-relaxed">
            看板的所有指标都严格来自真实作答记录。先去刷几道题，正确率、用时效率、考点掌握度与作息热力图才会逐一生效。
          </p>
          <DrawablyButton
            variant="solid"
            onClick={() => onSelectSubCategory?.("all", "all")}
            className="!px-6 !py-2.5 text-sm font-semibold"
          >
            <span className="flex items-center gap-2">
              <span>去刷题</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </DrawablyButton>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Metric Cards（全部由 answerRecords 派生，与页面其余视图同口径） */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e3d9c4] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium">
            <span>已练习题数</span>
            <Target className="w-4 h-4 text-[#b45309]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#26201a] mt-2 font-display">
            {d.total}{" "}
            <span className="text-xs font-normal text-[#8c7e6d]">
              / {allQuestions.length} 题
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[#15803d] font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>答对 {d.correct} 题（每题取最新一次）</span>
          </div>
        </div>

        <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e3d9c4] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium">
            <span>综合正确率</span>
            <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#15803d] mt-2 font-display">
            {d.accuracy}%
          </div>
          <div className="mt-1 text-[11px] text-[#786c5e] font-medium">
            错题待消: {stats.mistakeIds.length} 题
          </div>
        </div>

        <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e3d9c4] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium">
            <span>连续打卡</span>
            <Flame className="w-4 h-4 text-[#c2410c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#c2410c] mt-2 font-display">
            {stats.streakDays}{" "}
            <span className="text-xs font-normal text-[#8c7e6d]">天</span>
          </div>
          <div className="mt-1 text-[11px] text-[#786c5e] font-medium">
            题库覆盖 {Math.round((d.total / allQuestions.length) * 100)}%
          </div>
        </div>

        <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e3d9c4] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium">
            <span>平均单题用时</span>
            <Clock className="w-4 h-4 text-[#6b3b1f]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#6b3b1f] mt-2 font-display">
            {d.averageTimeSec || "—"}{" "}
            <span className="text-xs font-normal text-[#8c7e6d]">秒</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6b3b1f] font-medium">
            建议配速 ≤ 50 秒
          </div>
        </div>
      </motion.div>

      {/* 近 7 天 vs 之前趋势（attempts 驱动） */}
      {trend.recent && trend.before && trendDelta !== null && (
        <motion.div
          variants={itemVariants}
          className="bg-[#fdfbf7] rounded-2xl border border-[#e3d9c4] shadow-2xs px-5 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs text-[#786c5e]"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-[#b45309]" />近 7 天：
            <strong className="text-[#26201a]">{trend.recent.count}</strong> 题
            · 正确率{" "}
            <strong className="text-[#26201a]">{trend.recent.acc}%</strong>
          </span>
          <span>
            此前：
            <strong className="text-[#26201a]">{trend.before.count}</strong> 题
            · 正确率{" "}
            <strong className="text-[#26201a]">{trend.before.acc}%</strong>
          </span>
          <span
            className={`font-bold ${
              trendDelta >= 0 ? "text-[#15803d]" : "text-[#b91c1c]"
            }`}
          >
            {trendDelta >= 0 ? "↑" : "↓"} {Math.abs(trendDelta)} 个百分点
          </span>
        </motion.div>
      )}

      {/* 单题用时效率诊断（真实用时因子） */}
      <motion.div variants={itemVariants} className="space-y-4">
        <CollapseBar
          title={
            <>
              <Clock className="w-4 h-4 text-[#b45309]" />
              <span>单题用时效率诊断</span>
            </>
          }
          hint="建议配速 ≤ 50 秒"
          open={!isCollapsed("time", true)}
          onToggle={() => toggleSection("time")}
        />
        {!isCollapsed("time", true) && (
          <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-2xs space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#edf7ee] border border-[#bbf7d0]">
                <div className="text-[11px] text-[#14532d] font-semibold">
                  快而稳 (≤30s)
                </div>
                <div className="text-xl font-extrabold text-[#15803d] mt-1 font-display">
                  {d.fastCount} <span className="text-xs font-normal">题</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#fef7ea] border border-[#ebdcb9]">
                <div className="text-[11px] text-[#78350f] font-semibold">
                  达标区间 (30-60s)
                </div>
                <div className="text-xl font-extrabold text-[#b45309] mt-1 font-display">
                  {d.normalCount}{" "}
                  <span className="text-xs font-normal">题</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca]">
                <div className="text-[11px] text-[#991b1b] font-semibold">
                  偏慢待提速 (&gt;60s)
                </div>
                <div className="text-xl font-extrabold text-[#b91c1c] mt-1 font-display">
                  {d.slowCount} <span className="text-xs font-normal">题</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {d.categoryStats.map((cat) => (
                <div
                  key={cat.key}
                  className="p-3 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2]"
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span>{cat.name}</span>
                    <span className="text-[#6b3b1f]">
                      {cat.avgTimeSec || "—"}s
                    </span>
                  </div>
                  <div className="w-full bg-[#ded3be] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cat.avgTimeSec <= 50
                          ? "bg-[#15803d]"
                          : cat.avgTimeSec <= 60
                            ? "bg-[#b45309]"
                            : "bg-[#b91c1c]"
                      }`}
                      style={{
                        width: `${Math.min(100, (cat.avgTimeSec / 90) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#8c7e6d]">
              模考中未逐题计时的作答不参与用时统计。
            </p>
          </div>
        )}
      </motion.div>

      {/* 三板块 · 分考点正确率（图推视图泛化：比较职责归列表，点击行跳专项练习） */}
      <motion.div variants={itemVariants} className="space-y-4">
        <CollapseBar
          title={
            <>
              <BarChart2 className="w-4 h-4 text-[#b45309]" />
              <span>三板块 · 分考点正确率</span>
            </>
          }
          hint="点击行跳转专项练习"
          open={!isCollapsed("subcat", true)}
          onToggle={() => toggleSection("subcat")}
        />
        {!isCollapsed("subcat", true) && (
          <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-2xs space-y-3">
            {CATEGORIES.map((cat) => {
              const rows = d.subStats[cat.key];
              const catStat = d.categoryStats.find((c) => c.key === cat.key)!;
              // 默认展开有作答数据的板块、折叠空板块
              const open = !isCollapsed(
                `subcat-${cat.key}`,
                catStat.totalAnswered > 0,
              );
              return (
                <div
                  key={cat.key}
                  className="rounded-xl border border-[#e3d8c2] overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => toggleSection(`subcat-${cat.key}`)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#f8f3e8] hover:bg-[#f3ead7] transition-colors text-left cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#26201a]">
                      {cat.name}
                      <span className="text-[10px] text-[#8c7e6d] font-normal ml-1.5">
                        共 {rows.length} 类考点 · 题库 {catStat.bankTotal} 题
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-[11px]">
                      <span
                        className={
                          catStat.totalAnswered > 0
                            ? catStat.accuracy >= 60
                              ? "text-[#15803d] font-semibold"
                              : "text-[#b91c1c] font-semibold"
                            : "text-[#8c7e6d]"
                        }
                      >
                        {catStat.totalAnswered > 0
                          ? `正确率 ${catStat.accuracy}% · 已练 ${catStat.totalAnswered} 题`
                          : "暂无作答"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8c7e6d] shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
                      />
                    </span>
                  </button>
                  {open && (
                    <div className="p-3 space-y-2.5">
                      {rows.map((row) => (
                        <button
                          key={row.sub}
                          type="button"
                          onClick={() =>
                            onSelectSubCategory?.(cat.key, row.sub)
                          }
                          className="w-full text-left p-3 rounded-xl bg-[#f8f3e8] border border-[#e3d8c2] hover:border-[#b45309] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span className="text-[#26201a]">
                              {row.sub}
                              <span className="text-[10px] text-[#8c7e6d] font-normal ml-1.5">
                                题库 {row.bankTotal} 题
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              {row.total > 0 ? (
                                <span
                                  className={
                                    row.acc >= 60
                                      ? "text-[#15803d]"
                                      : "text-[#b91c1c]"
                                  }
                                >
                                  {row.acc}% · {row.correct}/{row.total} 题
                                  {row.avgSec > 0 ? ` · 均 ${row.avgSec}s` : ""}
                                </span>
                              ) : (
                                <span className="text-[#8c7e6d]">
                                  暂无作答 · 去练习
                                </span>
                              )}
                              <ArrowRight className="w-3 h-3 text-[#8c7e6d]" />
                            </span>
                          </div>
                          <div className="w-full bg-[#ded3be] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${row.acc >= 60 ? "bg-[#15803d]" : row.total > 0 ? "bg-[#b91c1c]" : "bg-transparent"}`}
                              style={{ width: `${row.acc}%` }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <p className="text-[11px] text-[#8c7e6d]">
              各行取每题最新一次作答；点击行跳转对应考点专项练习。
            </p>
          </div>
        )}
      </motion.div>

      {/* 知识图谱（探索与前置依赖职责） */}
      <motion.div variants={itemVariants} className="space-y-4">
        <CollapseBar
          title={
            <>
              <BarChart2 className="w-4 h-4 text-[#b45309]" />
              <span>知识图谱与弱项拓扑</span>
            </>
          }
          hint="D3 力导向 · 点击节点查看详情"
          open={!isCollapsed("graph", true)}
          onToggle={() => toggleSection("graph")}
        />
        {!isCollapsed("graph", true) && (
          <KnowledgeGraph
            stats={stats}
            answerRecords={answerRecords}
            onSelectSubCategory={onSelectSubCategory}
          />
        )}
      </motion.div>

      {/* 作息热力图（全量 attempts，反映真实学习作息） */}
      <motion.div variants={itemVariants} className="space-y-4">
        <CollapseBar
          title={
            <>
              <Clock className="w-4 h-4 text-[#b45309]" />
              <span>作息时段热力图</span>
            </>
          }
          hint="24 小时 / 周 · 真实作答分布"
          open={!isCollapsed("heatmap", true)}
          onToggle={() => toggleSection("heatmap")}
        />
        {!isCollapsed("heatmap", true) && (
          <StudyScheduleHeatmap attempts={answerAttempts} />
        )}
      </motion.div>

      {/* 能力雷达 + 方法论 + 真 AI 诊断入口 */}
      <motion.div variants={itemVariants} className="space-y-4">
        <CollapseBar
          title={
            <>
              <BarChart2 className="w-4 h-4 text-[#b45309]" />
              <span>能力雷达与备考锦囊</span>
            </>
          }
          hint="真实作答 · 未练习维度不绘制"
          open={!isCollapsed("radar", true)}
          onToggle={() => toggleSection("radar")}
        />
        {!isCollapsed("radar", true) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Competency Radar */}
            <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e8ded0]">
                <h3 className="font-bold text-[#26201a] text-sm sm:text-base flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#b45309]" />
                  <span>能力雷达图</span>
                </h3>
                <span className="text-[11px] text-[#786c5e]">基准为参考值</span>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#ded3bd" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fill: "#4a3e31" }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: "#8c7e6d" }}
                    />
                    <Radar
                      name="我的能力"
                      dataKey="value"
                      stroke="#b45309"
                      fill="#b45309"
                      fillOpacity={0.35}
                    />
                    <Radar
                      name="参考基准"
                      dataKey="benchmark"
                      stroke="#cfc1aa"
                      fill="#cfc1aa"
                      fillOpacity={0.15}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-[#8c7e6d] -mt-1">
                各维度均为真实作答正确率（每题最新一次）；未练习的维度不绘制数值点。「图形规律进阶」含重叠相消、时针旋转、数量规律、黑白位运算、位置移动。
              </p>
            </div>

            {/* 静态方法论 + 真 AI 学情诊断入口 */}
            <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-2 border-b border-[#e8ded0]">
                  <BookOpen className="w-4 h-4 text-[#b45309]" />
                  <h3 className="font-bold text-[#26201a] text-sm sm:text-base">
                    备考方法论速查
                  </h3>
                </div>

                <div className="mt-4 space-y-3 text-xs sm:text-sm">
                  <div className="p-3 bg-[#fef7ea] rounded-xl border border-[#ebdcb9]">
                    <span className="font-bold text-[#78350f]">
                      📌 图形推理突破策略：
                    </span>
                    <p className="text-[#854d0e] text-xs mt-1 leading-relaxed">
                      重点关注<strong>重叠相消</strong>与
                      <strong>时针步长旋转</strong>
                      。在图推实验室中多演练，掌握“先定基准点，再看独立轨迹”的秒杀思路。
                    </p>
                  </div>

                  <div className="p-3 bg-[#edf7ee] rounded-xl border border-[#bbf7d0]">
                    <span className="font-bold text-[#14532d]">
                      📌 资料分析速算提速：
                    </span>
                    <p className="text-[#166534] text-xs mt-1 leading-relaxed">
                      熟记<strong>百化分口诀</strong>（如 16.7%=1/6,
                      14.3%=1/7），遇到求增长量直接使用 <code>现期/(n+1)</code>
                      ，计算时间可从 45 秒缩短至 10 秒以内！
                    </p>
                  </div>

                  <div className="p-3 bg-[#f8f3e8] rounded-xl border border-[#ded2bd]">
                    <span className="font-bold text-[#4a3e31]">
                      📌 言语理解排雷抓手：
                    </span>
                    <p className="text-[#6e6153] text-xs mt-1 leading-relaxed">
                      牢抓<strong>转折连词</strong>（然而、但是、其实）和
                      <strong>对策词</strong>
                      （应当、必须），主旨题直接锁定中心句，排除绝对化与偷换概念选项。
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <DrawablyButton
                  variant="solid"
                  onClick={() => setIsDiagnoseOpen(true)}
                  className="w-full !py-2.5 text-xs font-semibold"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>生成我的 AI 学情诊断</span>
                  </span>
                </DrawablyButton>
                <p className="text-[11px] text-[#8c7e6d] text-center">
                  基于你的真实作答与错题记录生成（与错题本同一入口）
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* 真 AI 学情诊断弹窗（server diagnose 链路，与错题本共用） */}
      <AIDiagnoseModal
        isOpen={isDiagnoseOpen}
        onClose={() => setIsDiagnoseOpen(false)}
        mistakeIds={stats.mistakeIds}
        answerRecords={answerRecords}
        stats={stats}
      />
    </motion.div>
  );
};
