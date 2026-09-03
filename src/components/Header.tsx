import type React from "react";
import { useState, useEffect } from "react";
import type { ActiveTab, StudyStats } from "../types";
import type { StudyReminderConfig } from "./StudyReminder";
import { DrawablyButton } from "drawably/react";
import { drawablyUnderline } from "drawably";
import { useSketch } from "./sketch";
import {
  BookOpen,
  Shapes,
  Timer,
  BookMarked,
  Sparkles,
  Award,
  BarChart2,
  RotateCcw,
  CheckCircle2,
  Bell,
} from "lucide-react";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: StudyStats;
  aiBankCount?: number;
  onOpenAIChat: () => void;
  onResetStats: () => void;
  reminderConfig: StudyReminderConfig | null;
  onOpenReminderModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  aiBankCount = 0,
  onOpenAIChat,
  onResetStats,
  reminderConfig,
  onOpenReminderModal,
}) => {
  const [timeLeftStr, setTimeLeftStr] = useState<string>("");

  // Live countdown string if reminder is active
  useEffect(() => {
    if (
      !reminderConfig ||
      !reminderConfig.enabled ||
      reminderConfig.hasTriggered ||
      !reminderConfig.targetTimestamp
    ) {
      setTimeLeftStr("");
      return;
    }

    const updateTimer = () => {
      const remainingMs = Math.max(
        0,
        (reminderConfig.targetTimestamp || 0) - Date.now(),
      );
      if (remainingMs <= 0) {
        setTimeLeftStr("00:00");
      } else {
        const mins = Math.floor(remainingMs / 60000);
        const secs = Math.floor((remainingMs % 60000) / 1000);
        setTimeLeftStr(
          `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reminderConfig]);

  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

  const mistakeCount = stats.mistakeIds.length;

  const navItems = [
    { id: "practice", label: "题库精练", icon: BookOpen, badge: null },
    { id: "graphic-lab", label: "图推实验室", icon: Shapes, badge: "高频考点" },
    { id: "exam", label: "全真模考", icon: Timer, badge: null },
    {
      id: "mistakes",
      label: "错题本",
      icon: BookMarked,
      badge: mistakeCount > 0 ? `${mistakeCount}` : null,
    },
    {
      id: "ai-bank",
      label: "AI 变式题库",
      icon: Sparkles,
      badge: aiBankCount > 0 ? `${aiBankCount}` : null,
    },
    { id: "cheatsheet", label: "考点与速算宝典", icon: Award, badge: null },
    { id: "analytics", label: "学情看板", icon: BarChart2, badge: null },
  ];

  // 活动页签的手绘下划线：随 activeTab 移动，换页即换一笔新墨
  const activeUnderlineRef = useSketch<HTMLSpanElement>(
    (el) => drawablyUnderline(el, { width: 2.5 }),
    [activeTab],
  );

  return (
    <header className="sticky top-0 z-40 bg-[#f8f3e7]/95 backdrop-blur border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 品牌：手绘圆圈里的图形 + 墨笔下划线的名字 */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab("practice")}
          >
            <div className="w-10 h-10 flex items-center justify-center text-[color:var(--ink-accent)]">
              <Shapes className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg tracking-tight text-[color:var(--ink)]">
                  上岸测评
                </span>
                <span className="text-[10px] px-1.5 py-0.5 font-semibold text-[color:var(--ink-accent)]">
                  2026 · AI 手账版
                </span>
              </div>
              <p className="text-xs text-[color:var(--ink-soft)] hidden sm:block">
                言语理解 · 资料分析 · 复杂图推 · AI思维链拆解
              </p>
            </div>
          </div>

          {/* 学习速览：手写体数字 */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-[color:var(--ink-soft)] border border-dashed border-[#d8c9a8] px-4 py-1.5 rounded-sm bg-[var(--card)]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[color:var(--ink-accent)]" />
              <span>
                已练:{" "}
                <strong className="font-display text-sm text-[color:var(--ink)]">
                  {stats.totalAnswered}
                </strong>{" "}
                题
              </span>
            </div>
            <div className="h-3 w-px bg-[#d8c9a8]" />
            <div>
              <span>
                正确率:{" "}
                <strong className="font-display text-sm text-[color:var(--ink)]">
                  {accuracy}%
                </strong>
              </span>
            </div>
            <div className="h-3 w-px bg-[#d8c9a8]" />
            <div className="flex items-center gap-1">
              <span className="text-[color:var(--ink-accent)]">🔥</span>
              <span>
                打卡:{" "}
                <strong className="font-display text-sm text-[color:var(--ink)]">
                  {stats.streakDays}
                </strong>{" "}
                天
              </span>
            </div>
          </div>

          {/* 右侧动作：手绘按钮 */}
          <div className="flex items-center gap-2">
            <DrawablyButton
              onClick={onOpenReminderModal}
              className="!px-2.5 !py-1.5 text-xs font-semibold text-[color:var(--ink-soft)] hover:!text-[color:var(--ink-accent-strong)] transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Bell
                  className={`w-3.5 h-3.5 ${reminderConfig?.enabled && !reminderConfig?.hasTriggered ? "text-[color:var(--ink-accent)]" : ""}`}
                />
                <span className="hidden sm:inline">
                  {reminderConfig?.enabled &&
                  !reminderConfig?.hasTriggered &&
                  timeLeftStr ? (
                    <span className="font-display font-bold text-[color:var(--ink-accent)]">
                      {timeLeftStr}
                    </span>
                  ) : (
                    "学习提醒"
                  )}
                </span>
              </span>
            </DrawablyButton>

            <DrawablyButton
              variant="solid"
              onClick={onOpenAIChat}
              className="!px-3.5 !py-1.5 text-xs font-bold"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI 导师答疑</span>
              </span>
            </DrawablyButton>

            <DrawablyButton
              onClick={onResetStats}
              tone="neutral"
              className="!p-2 text-xs font-medium"
              aria-label="重置练习记录"
              title="重置练习记录与学情"
            >
              <span className="flex items-center gap-1 text-[color:var(--ink-soft)]">
                <RotateCcw className="w-4 h-4" />
                <span className="hidden md:inline">重置记录</span>
              </span>
            </DrawablyButton>
          </div>
        </div>

        {/* 页签：书签排布，活动页签带一笔墨线 */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 -mb-px no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer bg-transparent border-0 ${
                  isActive
                    ? "text-[color:var(--ink-accent-strong)] font-bold"
                    : "text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-[color:var(--ink-accent)]" : "text-[#a89478]"}`}
                />
                {isActive ? (
                  <span ref={activeUnderlineRef} className="inline-block">
                    {item.label}
                  </span>
                ) : (
                  <span>{item.label}</span>
                )}
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 font-bold ${
                      item.id === "mistakes"
                        ? "bg-[#fbe3d6] text-[#a63a22]"
                        : "bg-[var(--marker)]/60 text-[#7c5a10]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
