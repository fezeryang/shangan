import type React from 'react';
import { useState, useEffect } from 'react';
import type { ActiveTab, StudyStats } from '../types';
import type { StudyReminderConfig } from './StudyReminder';
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
} from 'lucide-react';

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
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');

  // Live countdown string if reminder is active
  useEffect(() => {
    if (!reminderConfig || !reminderConfig.enabled || reminderConfig.hasTriggered || !reminderConfig.targetTimestamp) {
      setTimeLeftStr('');
      return;
    }

    const updateTimer = () => {
      const remainingMs = Math.max(0, (reminderConfig.targetTimestamp || 0) - Date.now());
      if (remainingMs <= 0) {
        setTimeLeftStr('00:00');
      } else {
        const mins = Math.floor(remainingMs / 60000);
        const secs = Math.floor((remainingMs % 60000) / 1000);
        setTimeLeftStr(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reminderConfig]);

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  const mistakeCount = stats.mistakeIds.length;

  const navItems = [
    { id: 'practice', label: '题库精练', icon: BookOpen, badge: null },
    { id: 'graphic-lab', label: '图推实验室', icon: Shapes, badge: '高频考点' },
    { id: 'exam', label: '全真模考', icon: Timer, badge: null },
    { id: 'mistakes', label: '错题本', icon: BookMarked, badge: mistakeCount > 0 ? `${mistakeCount}` : null },
    { id: 'ai-bank', label: 'AI 变式题库', icon: Sparkles, badge: aiBankCount > 0 ? `${aiBankCount}` : null },
    { id: 'cheatsheet', label: '考点与速算宝典', icon: Award, badge: null },
    { id: 'analytics', label: '学情看板', icon: BarChart2, badge: null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f4]/95 backdrop-blur border-b border-[#e3d9c4] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('practice')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b45309] to-[#c2410c] flex items-center justify-center text-white shadow-md shadow-[#b45309]/20 border border-[#9a3412]">
              <Shapes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#26201a] font-display">
                  上岸测评·智学平台
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#fef7ea] text-[#854d0e] border border-[#ebdcb9] font-semibold">
                  2026 AI增强版
                </span>
              </div>
              <p className="text-xs text-[#786c5e] hidden sm:block">
                言语理解 · 资料分析 · 复杂图推 · AI思维链拆解
              </p>
            </div>
          </div>

          {/* Quick Study Stats Pill */}
          <div className="hidden lg:flex items-center gap-4 bg-[#f6f0e3] border border-[#ded3bd] rounded-full px-4 py-1.5 text-xs text-[#5c4e3f]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
              <span>已练: <strong className="text-[#26201a] font-bold">{stats.totalAnswered}</strong> 题</span>
            </div>
            <div className="h-3 w-px bg-[#ded3bd]" />
            <div>
              <span>正确率: <strong className="text-[#15803d] font-bold">{accuracy}%</strong></span>
            </div>
            <div className="h-3 w-px bg-[#ded3bd]" />
            <div className="flex items-center gap-1">
              <span className="text-[#b45309]">🔥</span>
              <span>打卡: <strong className="text-[#26201a] font-bold">{stats.streakDays}</strong> 天</span>
            </div>
          </div>

          {/* Actions: Study Reminder, AI Tutor, Reset */}
          <div className="flex items-center gap-2">
            {/* Study Reminder Trigger Button */}
            <button
              onClick={onOpenReminderModal}
              title={reminderConfig?.enabled && !reminderConfig?.hasTriggered ? `专注提醒运行中: ${timeLeftStr}` : '设定学习与专注提醒'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                reminderConfig?.enabled && !reminderConfig?.hasTriggered
                  ? 'bg-[#fef7eb] border-[#b45309] text-[#854d0e] shadow-2xs'
                  : 'bg-[#fffdfa] border-[#ded2bd] text-[#5c4e3f] hover:bg-[#f6eee0] hover:border-[#b45309]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Bell className={`w-3.5 h-3.5 ${reminderConfig?.enabled && !reminderConfig?.hasTriggered ? 'text-[#b45309]' : 'text-[#8c7e6d]'}`} />
                {reminderConfig?.enabled && !reminderConfig?.hasTriggered && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
                )}
              </div>
              <span className="hidden sm:inline">
                {reminderConfig?.enabled && !reminderConfig?.hasTriggered && timeLeftStr ? (
                  <span className="font-mono text-[#b45309] font-bold">{timeLeftStr}</span>
                ) : (
                  '学习提醒'
                )}
              </span>
            </button>

            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#c2410c] hover:from-[#9a3412] hover:to-[#a13208] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI 导师答疑</span>
            </button>

            <button
              onClick={onResetStats}
              title="重置练习记录与学情"
              aria-label="重置练习记录"
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 text-[#8c7e6d] hover:text-[#b91c1c] hover:bg-[#fee2e2]/60 rounded-xl transition-colors cursor-pointer border border-[#ded3bd] hover:border-[#fca5a5] text-xs font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">重置记录</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 -mb-px no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f5ede0] text-[#854d0e] font-bold border-b-2 border-[#b45309] shadow-2xs'
                    : 'text-[#6e6153] hover:text-[#26201a] hover:bg-[#f3ebd9]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#b45309]' : 'text-[#8c7e6d]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      item.id === 'mistakes'
                        ? 'bg-[#fee2e2] text-[#991b1b]'
                        : 'bg-[#fef3c7] text-[#92400e]'
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
