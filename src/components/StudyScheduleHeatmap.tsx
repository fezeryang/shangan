import type React from "react";
import { useState, useMemo } from "react";
import type { AnswerAttempt } from "../types";
import {
  Clock,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Zap,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface StudyScheduleHeatmapProps {
  /** 全量作答历史（含重做轨迹），作息分布反映真实学习时间而非每题最后一次 */
  attempts: AnswerAttempt[];
}

type HeatmapMode = "productivity" | "accuracy" | "volume";
type ViewType = "hourly" | "weekMatrix";

interface HourlyData {
  hour: number; // 0 - 23
  label: string; // "09:00"
  timeSlotName: string;
  period: "night" | "morning" | "noon" | "afternoon" | "evening" | "lateNight";
  totalAnswered: number;
  correctCount: number;
  accuracy: number;
  avgTimeSec: number;
  productivityScore: number;
  errorRisk: "low" | "medium" | "high" | null;
  recommendedTasks: string;
  hasData: boolean;
}

interface WeekMatrixCell {
  day: number;
  dayName: string;
  blockIndex: number;
  blockName: string;
  timeRange: string;
  total: number;
  correct: number;
  accuracy: number;
  productivity: number;
}

const TIME_PERIOD_CONFIG: Record<
  string,
  { name: string; period: HourlyData["period"]; task: string }
> = {
  0: { name: "深夜疲劳期", period: "lateNight", task: "建议休息或仅复盘温习" },
  1: { name: "深夜休眠期", period: "lateNight", task: "大脑疲惫，禁止刷难题" },
  2: { name: "深夜休眠期", period: "lateNight", task: "充足睡眠是考前关键" },
  3: { name: "深夜休眠期", period: "lateNight", task: "睡眠恢复" },
  4: { name: "凌晨苏醒期", period: "night", task: "晨起轻量回顾公式" },
  5: { name: "清晨预热期", period: "night", task: "常识记忆与公式默写" },
  6: { name: "晨起唤醒期", period: "morning", task: "言语理解快速热身" },
  7: { name: "晨间黄金期", period: "morning", task: "言语阅读 & 资料速算" },
  8: { name: "上午专注期", period: "morning", task: "全真模考 & 图形推理" },
  9: {
    name: "上午心流爆发期",
    period: "morning",
    task: "重难点攻坚：复杂图推与资料分析",
  },
  10: {
    name: "上午心流爆发期",
    period: "morning",
    task: "真题高强度冲刺与限时压测",
  },
  11: { name: "上午高效收尾", period: "morning", task: "短平快单项突破" },
  12: {
    name: "午间生理恢复",
    period: "noon",
    task: "午休补充精力，避免复杂计算",
  },
  13: { name: "午后倦怠期", period: "noon", task: "做题易粗心，建议错题复盘" },
  14: {
    name: "下午能量回升",
    period: "afternoon",
    task: "言语细节推断与逻辑填空",
  },
  15: {
    name: "下午思维高峰",
    period: "afternoon",
    task: "资料分析图表与基期比重计算",
  },
  16: {
    name: "下午高效攻坚",
    period: "afternoon",
    task: "空间折叠与重叠相消专项",
  },
  17: { name: "傍晚练习期", period: "afternoon", task: "回顾全天错题本" },
  18: {
    name: "晚间用餐休整",
    period: "evening",
    task: "轻松翻阅速算技巧小卡片",
  },
  19: {
    name: "晚间黄金心流期",
    period: "evening",
    task: "完整套卷全真模考 (建议与上机同频)",
  },
  20: {
    name: "晚间黄金心流期",
    period: "evening",
    task: "限时提速挑战 & 难点攻破",
  },
  21: {
    name: "晚间巩固期",
    period: "evening",
    task: "知识图谱薄弱节点定向补强",
  },
  22: { name: "夜间复盘期", period: "lateNight", task: "当天错题二次重做" },
  23: { name: "睡前整理期", period: "lateNight", task: "查漏补缺，放松心态" },
};

const DAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const TIME_BLOCKS = [
  {
    name: "早晨 (06:00-09:00)",
    range: "06:00-09:00",
    startHour: 6,
    endHour: 9,
  },
  {
    name: "上午 (09:00-12:00)",
    range: "09:00-12:00",
    startHour: 9,
    endHour: 12,
  },
  {
    name: "下午 (14:00-18:00)",
    range: "14:00-18:00",
    startHour: 14,
    endHour: 18,
  },
  {
    name: "晚间 (19:00-22:00)",
    range: "19:00-22:00",
    startHour: 19,
    endHour: 22,
  },
];

export const StudyScheduleHeatmap: React.FC<StudyScheduleHeatmapProps> = ({
  attempts,
}) => {
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("productivity");
  const [viewType, setViewType] = useState<ViewType>("hourly");
  const [selectedHour, setSelectedHour] = useState<number | null>(9);

  // 1. Process 24-hour Distribution（全量 attempts，未计时作答不进均时）
  const hourlyStats: HourlyData[] = useMemo(() => {
    const hourBuckets: Record<
      number,
      { total: number; correct: number; totalTime: number; timed: number }
    > = {};
    for (let h = 0; h < 24; h++) {
      hourBuckets[h] = { total: 0, correct: 0, totalTime: 0, timed: 0 };
    }

    attempts.forEach((rec) => {
      try {
        const date = new Date(rec.answeredAt);
        const h = date.getHours();
        if (h >= 0 && h < 24) {
          hourBuckets[h].total += 1;
          if (rec.isCorrect) hourBuckets[h].correct += 1;
          hourBuckets[h].totalTime += rec.timeSpentSec || 0;
          hourBuckets[h].timed += (rec.timeSpentSec || 0) > 0 ? 1 : 0;
        }
      } catch {
        // 无效时间戳跳过
      }
    });

    return Array.from({ length: 24 }, (_, hour) => {
      const cfg = TIME_PERIOD_CONFIG[hour] || {
        name: "平时段",
        period: "morning" as const,
        task: "日常练习",
      };
      const bucket = hourBuckets[hour];
      const hasRealData = bucket.total > 0;

      const rawAccuracy = hasRealData
        ? Math.round((bucket.correct / bucket.total) * 100)
        : 0;
      const avgTime =
        bucket.timed > 0 ? Math.round(bucket.totalTime / bucket.timed) : 0;
      const speedScore =
        avgTime > 0 ? Math.max(20, Math.min(100, 110 - avgTime)) : 0;
      const productivityScore = hasRealData
        ? avgTime > 0
          ? Math.round(rawAccuracy * 0.65 + speedScore * 0.35)
          : rawAccuracy
        : 0;

      let errorRisk: "low" | "medium" | "high" | null = null;
      if (hasRealData) {
        if (rawAccuracy >= 85) errorRisk = "low";
        else if (rawAccuracy <= 65 || productivityScore <= 55)
          errorRisk = "high";
        else errorRisk = "medium";
      }

      return {
        hour,
        label: `${hour.toString().padStart(2, "0")}:00`,
        timeSlotName: cfg.name,
        period: cfg.period,
        totalAnswered: bucket.total,
        correctCount: bucket.correct,
        accuracy: rawAccuracy,
        avgTimeSec: avgTime,
        productivityScore,
        errorRisk,
        recommendedTasks: cfg.task,
        hasData: hasRealData,
      };
    });
  }, [attempts]);

  // 2. Process Week Matrix（全量 attempts；能效与 24 小时图同公式：正确率×0.65 + 速度×0.35，无固定加成）
  const weekMatrix: WeekMatrixCell[][] = useMemo(() => {
    const matrix: WeekMatrixCell[][] = [];
    const recordsMap: Record<
      string,
      { total: number; correct: number; timedTotal: number; timed: number }
    > = {};
    attempts.forEach((rec) => {
      try {
        const date = new Date(rec.answeredAt);
        const day = date.getDay();
        const hour = date.getHours();
        let bIdx = -1;
        if (hour >= 6 && hour < 9) bIdx = 0;
        else if (hour >= 9 && hour < 12) bIdx = 1;
        else if (hour >= 14 && hour < 18) bIdx = 2;
        else if (hour >= 19 && hour < 22) bIdx = 3;

        if (bIdx !== -1) {
          const key = `${day}-${bIdx}`;
          if (!recordsMap[key])
            recordsMap[key] = { total: 0, correct: 0, timedTotal: 0, timed: 0 };
          recordsMap[key].total += 1;
          if (rec.isCorrect) recordsMap[key].correct += 1;
          recordsMap[key].timedTotal += rec.timeSpentSec || 0;
          recordsMap[key].timed += (rec.timeSpentSec || 0) > 0 ? 1 : 0;
        }
      } catch {
        // 无效时间戳跳过
      }
    });

    for (let day = 0; day < 7; day++) {
      const dayRow: WeekMatrixCell[] = [];
      TIME_BLOCKS.forEach((block, bIdx) => {
        const key = `${day}-${bIdx}`;
        const item = recordsMap[key];
        const hasData = item && item.total > 0;
        const acc = hasData ? Math.round((item.correct / item.total) * 100) : 0;
        const avgTime =
          item && item.timed > 0 ? Math.round(item.timedTotal / item.timed) : 0;
        const speedScore =
          avgTime > 0 ? Math.max(20, Math.min(100, 110 - avgTime)) : 0;
        const prod = hasData
          ? avgTime > 0
            ? Math.round(acc * 0.65 + speedScore * 0.35)
            : acc
          : 0;

        dayRow.push({
          day,
          dayName: DAY_NAMES[day],
          blockIndex: bIdx,
          blockName: block.name,
          timeRange: block.range,
          total: item ? item.total : 0,
          correct: item ? item.correct : 0,
          accuracy: acc,
          productivity: prod,
        });
      });
      matrix.push(dayRow);
    }
    return matrix;
  }, [attempts]);

  // 峰值/谷值完全来自真实作答数据（无数据时返回 null）
  const { bestHour, worstHour } = useMemo(() => {
    const practiced = hourlyStats.filter((h) => h.hasData);
    if (practiced.length === 0) return { bestHour: null, worstHour: null };
    const byScore = [...practiced].sort(
      (a, b) => b.productivityScore - a.productivityScore,
    );
    return { bestHour: byScore[0], worstHour: byScore[byScore.length - 1] };
  }, [hourlyStats]);

  const currentDetail = useMemo(() => {
    if (selectedHour === null) return hourlyStats[9];
    return hourlyStats.find((h) => h.hour === selectedHour) || hourlyStats[9];
  }, [selectedHour, hourlyStats]);

  // Color helper based on paper palette
  const getCellBgColor = (
    score: number,
    mode: HeatmapMode,
    isSelected: boolean,
  ) => {
    if (mode === "productivity" || mode === "accuracy") {
      if (score >= 90)
        return isSelected
          ? "bg-[#24683a] ring-2 ring-[#15803d] text-white"
          : "bg-[#2e7d47] hover:bg-[#24683a] text-white";
      if (score >= 80)
        return isSelected
          ? "bg-[#edf7ee] ring-2 ring-[#24683a] text-[#14532d] border border-[#a3d9ae]"
          : "bg-[#edf7ee] hover:bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]";
      if (score >= 70)
        return isSelected
          ? "bg-[#fef7ea] ring-2 ring-[#b45309] text-[#78350f] border border-[#ebdcb9]"
          : "bg-[#fef7ea] hover:bg-[#faeed6] text-[#854d0e] border border-[#ebdcb9]";
      if (score >= 55)
        return isSelected
          ? "bg-[#fff4ea] ring-2 ring-[#c2410c] text-[#9a3412] border border-[#f4d7b8]"
          : "bg-[#fff4ea] hover:bg-[#fee7d6] text-[#9a3412] border border-[#f4d7b8]";
      return isSelected
        ? "bg-[#fef2f2] ring-2 ring-[#b91c1c] text-[#991b1b] border border-[#fca5a5]"
        : "bg-[#fef2f2] hover:bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]";
    } else {
      // Volume mode
      if (score > 10)
        return isSelected
          ? "bg-[#b45309] ring-2 ring-[#9a3412] text-white"
          : "bg-[#b45309] text-white";
      if (score > 5)
        return isSelected
          ? "bg-[#d97706] ring-2 ring-[#b45309] text-white"
          : "bg-[#d97706] text-white";
      if (score > 0)
        return isSelected
          ? "bg-[#fef7ea] ring-2 ring-[#b45309] text-[#854d0e] border border-[#ebdcb9]"
          : "bg-[#fef7ea] text-[#854d0e] border border-[#ebdcb9]";
      return "bg-[#f8f3e8] text-[#8c7e6d] border border-[#e3d8c2]";
    }
  };

  return (
    <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-2xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8ded0]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fef7ea] text-[#b45309] border border-[#ebdcb9] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#26201a] text-base sm:text-lg flex items-center gap-2 font-display">
                <span>时段专注能效热力图</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#edf7ee] text-[#15803d] border border-[#bbf7d0] font-semibold">
                  2026 科学作息排程
                </span>
              </h3>
              <p className="text-xs text-[#786c5e] mt-0.5">
                追踪 24
                小时生物节律与刷题正确率变化，避开易错疲劳陷阱，锁定个人高效冲刺黄金窗口
              </p>
            </div>
          </div>
        </div>

        {/* View & Metric Mode Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-xl bg-[#f6efe2] p-1 text-xs border border-[#e8ded0]">
            <button
              onClick={() => setViewType("hourly")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewType === "hourly"
                  ? "bg-[#fffdfa] text-[#26201a] font-bold shadow-2xs"
                  : "text-[#6e6153] hover:text-[#26201a]"
              }`}
            >
              24小时全天分布
            </button>
            <button
              onClick={() => setViewType("weekMatrix")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewType === "weekMatrix"
                  ? "bg-[#fffdfa] text-[#26201a] font-bold shadow-2xs"
                  : "text-[#6e6153] hover:text-[#26201a]"
              }`}
            >
              周作息黄金矩阵
            </button>
          </div>

          <div className="inline-flex rounded-xl bg-[#f6efe2] p-1 text-xs border border-[#e8ded0]">
            <button
              onClick={() => setHeatmapMode("productivity")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                heatmapMode === "productivity"
                  ? "bg-[#b45309] text-white shadow-2xs font-bold"
                  : "text-[#6e6153] hover:text-[#26201a]"
              }`}
            >
              综合能效
            </button>
            <button
              onClick={() => setHeatmapMode("accuracy")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                heatmapMode === "accuracy"
                  ? "bg-[#b45309] text-white shadow-2xs font-bold"
                  : "text-[#6e6153] hover:text-[#26201a]"
              }`}
            >
              正确率
            </button>
            <button
              onClick={() => setHeatmapMode("volume")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                heatmapMode === "volume"
                  ? "bg-[#b45309] text-white shadow-2xs font-bold"
                  : "text-[#6e6153] hover:text-[#26201a]"
              }`}
            >
              答题活跃度
            </button>
          </div>
        </div>
      </div>

      {/* Top Highlight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Peak Performance Window */}
        <div className="p-4 rounded-xl bg-[#edf7ee] border border-[#bbf7d0]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#14532d]">
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#15803d]" />
              黄金心流做题时段
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d] text-[10px] font-bold">
              {bestHour ? "综合能效最高" : "等待作答数据"}
            </span>
          </div>
          <div className="mt-2 text-xl font-extrabold text-[#14532d] font-display">
            {bestHour ? bestHour.label : "暂无数据"}
          </div>
          <div className="mt-1 text-xs text-[#166534] leading-relaxed">
            {bestHour
              ? `你在该时段共作答 ${bestHour.totalAnswered} 题，正确率 ${bestHour.accuracy}%，综合能效 ${bestHour.productivityScore} 分，最适宜攻坚复杂图推与全真模考。`
              : "完成练习后，这里会基于你的真实作答自动计算最专注的做题时段。"}
          </div>
        </div>

        {/* High Error Risk Warning */}
        <div className="p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#991b1b]">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#b91c1c]" />
              高危疲劳易错预警
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#fee2e2] text-[#991b1b] text-[10px] font-bold">
              {worstHour ? "正确率最低" : "等待作答数据"}
            </span>
          </div>
          <div className="mt-2 text-xl font-extrabold text-[#7f1d1d] font-display">
            {worstHour ? worstHour.label : "暂无数据"}
          </div>
          <div className="mt-1 text-xs text-[#991b1b] leading-relaxed">
            {worstHour
              ? `你在该时段共作答 ${worstHour.totalAnswered} 题，正确率仅 ${worstHour.accuracy}%，建议此阶段安排错题温故或闭目休整。`
              : "完成练习后，这里会基于真实作答标记最容易出错的时段。"}
          </div>
        </div>
      </div>

      {/* Main Heatmap Visual Area */}
      {viewType === "hourly" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium px-1">
            <span>
              24小时全天候能效节律（点击任意时段方块查看详细指标与推荐任务）：
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-[#2e7d47] inline-block" />{" "}
                极佳 (≥90)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-[#edf7ee] border border-[#bbf7d0] inline-block" />{" "}
                良好 (80-89)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-[#fef7ea] border border-[#ebdcb9] inline-block" />{" "}
                平稳 (70-79)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-[#fff4ea] border border-[#f4d7b8] inline-block" />{" "}
                波动 (55-69)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-[#fef2f2] border border-[#fecaca] inline-block" />{" "}
                疲劳 (&lt;55)
              </span>
            </div>
          </div>

          {/* 24-Hour Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-24 gap-1.5 p-3 bg-[#f8f3e8] rounded-2xl border border-[#e3d8c2]">
            {hourlyStats.map((item) => {
              const val =
                heatmapMode === "productivity"
                  ? item.productivityScore
                  : heatmapMode === "accuracy"
                    ? item.accuracy
                    : item.totalAnswered;
              const isSelected = selectedHour === item.hour;
              const noDataClass = item.hasData
                ? ""
                : "bg-[#f8f3e8] text-[#8c7e6d] border border-[#e3d8c2] hover:bg-[#f1eadb]";

              return (
                <button
                  key={item.hour}
                  onClick={() => setSelectedHour(item.hour)}
                  className={`group relative flex flex-col items-center justify-between p-2 rounded-xl text-center transition-all cursor-pointer ${
                    item.hasData
                      ? getCellBgColor(val, heatmapMode, isSelected)
                      : noDataClass
                  } ${isSelected ? "scale-105 shadow-md z-10" : ""}`}
                >
                  <span className="text-[10px] font-semibold opacity-85">
                    {item.hour}:00
                  </span>
                  <span className="text-xs font-bold my-1">
                    {item.hasData
                      ? heatmapMode === "volume"
                        ? `${item.totalAnswered}题`
                        : `${val}%`
                      : "—"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full" />
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Hour Focus Card */}
          {currentDetail && (
            <div className="p-4 rounded-2xl bg-[#2c241d] text-[#faf6ee] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-[#4a3e31]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-display text-white">
                    {currentDetail.label} -{" "}
                    {(currentDetail.hour + 1).toString().padStart(2, "0")}:00
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[#ded3bd] font-medium">
                    {currentDetail.timeSlotName}
                  </span>
                  {currentDetail.errorRisk === "low" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#24683a]/40 text-[#86efac] font-medium border border-[#24683a]">
                      🟢 极低易错风险
                    </span>
                  )}
                  {currentDetail.errorRisk === "high" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#b91c1c]/40 text-[#fca5a5] font-medium border border-[#b91c1c]">
                      🔴 疲劳易错高危
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#ded3be] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
                  推荐安排：
                  <span className="text-[#fef08a] font-semibold">
                    {currentDetail.recommendedTasks}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="bg-white/10 px-3 py-2 rounded-xl text-center">
                  <div className="text-[11px] text-[#ded3be]">综合能效</div>
                  <div className="text-base font-extrabold text-[#86efac] font-display">
                    {currentDetail.hasData ? (
                      <>
                        {currentDetail.productivityScore}{" "}
                        <span className="text-[10px] text-[#ded3be]">分</span>
                      </>
                    ) : (
                      <span className="text-[#8c7e6d]">—</span>
                    )}
                  </div>
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-xl text-center">
                  <div className="text-[11px] text-[#ded3be]">平均正确率</div>
                  <div className="text-base font-extrabold text-white font-display">
                    {currentDetail.hasData ? `${currentDetail.accuracy}%` : "—"}
                  </div>
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-xl text-center">
                  <div className="text-[11px] text-[#ded3be]">单题平均耗时</div>
                  <div className="text-base font-extrabold text-[#fed7aa] font-display">
                    {currentDetail.hasData ? (
                      <>
                        {currentDetail.avgTimeSec}{" "}
                        <span className="text-[10px] text-[#ded3be]">秒</span>
                      </>
                    ) : (
                      <span className="text-[#8c7e6d]">—</span>
                    )}
                  </div>
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-xl text-center">
                  <div className="text-[11px] text-[#ded3be]">历史答题量</div>
                  <div className="text-base font-extrabold text-[#fde047] font-display">
                    {currentDetail.totalAnswered}{" "}
                    <span className="text-[10px] text-[#ded3be]">题</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Week Matrix */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#786c5e] font-medium px-1">
            <span>周一至周日四大黄金时段能效矩阵：</span>
            <span className="text-[11px] text-[#8c7e6d]">
              基于全部作答时间分布统计，无固定加成
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e8ded0] text-[#786c5e]">
                  <th className="py-2.5 px-3 font-semibold">星期</th>
                  {TIME_BLOCKS.map((tb) => (
                    <th
                      key={tb.name}
                      className="py-2.5 px-3 font-semibold text-center"
                    >
                      <div>{tb.name}</div>
                      <div className="text-[10px] text-[#8c7e6d] font-normal">
                        {tb.range}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede4d2]">
                {weekMatrix.map((row, dayIdx) => (
                  <tr
                    key={dayIdx}
                    className="hover:bg-[#f8f3e8]/60 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-[#26201a]">
                      {row[0].dayName}
                    </td>
                    {row.map((cell, bIdx) => {
                      const val =
                        heatmapMode === "productivity"
                          ? cell.productivity
                          : heatmapMode === "accuracy"
                            ? cell.accuracy
                            : cell.total;
                      const noDataClass =
                        "bg-[#f8f3e8] text-[#8c7e6d] border border-[#e3d8c2]";
                      return (
                        <td key={bIdx} className="p-1.5 text-center">
                          <div
                            className={`py-2 px-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                              cell.total > 0
                                ? getCellBgColor(val, heatmapMode, false)
                                : noDataClass
                            }`}
                          >
                            <span className="font-bold text-xs">
                              {cell.total === 0
                                ? "—"
                                : heatmapMode === "volume"
                                  ? `${cell.total} 题`
                                  : `${val}%`}
                            </span>
                            <span className="text-[10px] opacity-80">
                              {cell.total > 0
                                ? `答对 ${cell.correct}`
                                : "暂无练习"}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4-Step Personalized Study Scheduling Plan */}
      <div className="pt-2">
        <h4 className="font-bold text-[#26201a] text-sm mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#b45309]" />
          <span>基于做题生理节律的【高分全天冲刺排程表】</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-[#ebdcb9] bg-[#fef7ea]/60 hover:bg-[#fef7ea] transition-colors space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#78350f]">
              <span className="flex items-center gap-1.5 text-[#854d0e]">
                <Sunrise className="w-4 h-4 text-[#b45309]" />
                阶段一：晨间启动 (07:30 - 08:30)
              </span>
            </div>
            <p className="text-[#854d0e] text-[11px] leading-relaxed">
              <strong>适宜科目：</strong>言语逻辑、选词填空与高频错题回顾。
              <br />
              <strong>目标：</strong>无需深度复杂计算，快速唤醒语感与逻辑链条。
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#bbf7d0] bg-[#edf7ee]/60 hover:bg-[#edf7ee] transition-colors space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#14532d]">
              <span className="flex items-center gap-1.5 text-[#15803d]">
                <Sun className="w-4 h-4 text-[#166534]" />
                阶段二：上午黄金攻坚 (09:00 - 11:30)
              </span>
            </div>
            <p className="text-[#15803d] text-[11px] leading-relaxed">
              <strong>适宜科目：</strong>图形推理 3D 折叠/空间截面 +
              全真模拟考试。
              <br />
              <strong>目标：</strong>大脑认知与注意力峰值期，严卡 50
              秒配速冲刺。
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#ded2bd] bg-[#f8f3e8]/60 hover:bg-[#f8f3e8] transition-colors space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#4a3e31]">
              <span className="flex items-center gap-1.5 text-[#6b3b1f]">
                <Sunset className="w-4 h-4 text-[#9a3412]" />
                阶段三：下午速算冲刺 (15:00 - 17:30)
              </span>
            </div>
            <p className="text-[#6b3b1f] text-[11px] leading-relaxed">
              <strong>适宜科目：</strong>资料分析两期比重、增长量百化分速算。
              <br />
              <strong>目标：</strong>训练一眼抓图表数字和直除法秒杀直觉。
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#e3d9c4] bg-[#fcf8ee]/60 hover:bg-[#fcf8ee] transition-colors space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#26201a]">
              <span className="flex items-center gap-1.5 text-[#854d0e]">
                <Moon className="w-4 h-4 text-[#b45309]" />
                阶段四：晚间复盘闭环 (20:00 - 21:40)
              </span>
            </div>
            <p className="text-[#5c4e3f] text-[11px] leading-relaxed">
              <strong>适宜科目：</strong>知识图谱薄弱节点定向拔高 +
              错题本重做清零。
              <br />
              <strong>目标：</strong>消灭易错盲区，巩固当天题感与解题模型。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
