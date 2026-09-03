import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Coffee,
  X,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Heart,
  Timer,
  Smile,
} from 'lucide-react';
import { DrawablyButton, DrawablyInput } from 'drawably/react';

export interface StudyReminderConfig {
  enabled: boolean;
  targetTimestamp: number | null;
  durationMinutes: number;
  message: string;
  soundEnabled: boolean;
  hasTriggered: boolean;
  createdAt: number;
}

// Gentle Web Audio synthesized chime (no external audio files needed)
export const playGentleChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Gentle chord frequencies (E4, G#4, B4, E5) - warm and peaceful
    const notes = [329.63, 415.30, 493.88, 659.25];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + index * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.12 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 2.0);
    });
  } catch {
    // Graceful fallback if browser restricts audio autoplay
  }
};

const DEFAULT_MESSAGES = [
  '🌱 专注时光圆满达成，起来喝口温水，眺望远方放松一下眼睛吧！',
  '☕ 学习辛苦啦！让大脑适度休息 5 分钟，思维会更加敏锐清醒。',
  '🧘 做一次深呼吸，转动一下肩颈，你今天的努力都在悄悄积累力量。',
  '✨ 劳逸结合才是高分秘诀，准备好开启下一轮题型复盘了吗？',
];

interface StudyReminderProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAlert: (message: string) => void;
  activeConfig: StudyReminderConfig | null;
  onUpdateConfig: (config: StudyReminderConfig | null) => void;
}

export const StudyReminderSettingsModal: React.FC<StudyReminderProps> = ({
  isOpen,
  onClose,
  activeConfig,
  onUpdateConfig,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(activeConfig?.durationMinutes || 25);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>(
    activeConfig?.message || DEFAULT_MESSAGES[0]
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(activeConfig?.soundEnabled ?? true);

  if (!isOpen) return null;

  const PRESETS = [
    { mins: 15, label: '15分钟', desc: '快速刷题' },
    { mins: 25, label: '25分钟', desc: '番茄钟专注' },
    { mins: 45, label: '45分钟', desc: '全真模考' },
    { mins: 60, label: '60分钟', desc: '深度复盘' },
  ];

  const handleStartTimer = (mins: number) => {
    const targetMs = Date.now() + mins * 60 * 1000;
    const config: StudyReminderConfig = {
      enabled: true,
      targetTimestamp: targetMs,
      durationMinutes: mins,
      message: customMessage.trim() || DEFAULT_MESSAGES[0],
      soundEnabled,
      hasTriggered: false,
      createdAt: Date.now(),
    };
    onUpdateConfig(config);
    if (soundEnabled) {
      playGentleChime();
    }
    onClose();
  };

  const handleCancelTimer = () => {
    onUpdateConfig(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#fdfbf7] rounded-3xl border border-[#e3d9c4] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#fef7ea] border border-[#ebdcb9] flex items-center justify-center text-[#b45309] shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#26201a] text-lg font-display flex items-center gap-2">
                <span>学习与专注推送提醒</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fef7ea] text-[#854d0e] border border-[#ebdcb9] font-medium">
                  本地持久存储
                </span>
              </h3>
              <p className="text-xs text-[#786c5e] mt-0.5">
                设定备考学习时长，时间到期后将以温和弹窗贴心提醒
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8c7e6d] hover:text-[#26201a] hover:bg-[#f3ebd9] rounded-xl transition-colors cursor-pointer"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Timer Status Banner (if running) */}
        {activeConfig && activeConfig.enabled && !activeConfig.hasTriggered && (
          <div className="p-3.5 bg-[#fef7eb] rounded-2xl border border-[#ebdcb9] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#15803d] animate-ping" />
              <div>
                <div className="text-xs font-bold text-[#26201a] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>当前正在进行中：{activeConfig.durationMinutes} 分钟专注</span>
                </div>
                <div className="text-[11px] text-[#786c5e] mt-0.5">
                  到期时间：
                  {new Date(activeConfig.targetTimestamp || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
            <button
              onClick={handleCancelTimer}
              className="px-3 py-1.5 bg-[#fffdfa] hover:bg-[#fee2e2] text-[#991b1b] border border-[#ded2bd] hover:border-[#fca5a5] rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>取消计时</span>
            </button>
          </div>
        )}

        {/* Duration Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#3b3127] flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-[#b45309]" />
            <span>选择专注学习时长</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p) => {
              const isSelected = selectedMinutes === p.mins;
              return (
                <DrawablyButton
                  key={p.mins}
                  variant={isSelected ? 'scribble' : 'outline'}
                  onClick={() => {
                    setSelectedMinutes(p.mins);
                    setCustomMinutes('');
                  }}
                  className="!p-3 text-center"
                >
                  <span className="block text-sm font-display font-bold">{p.label}</span>
                  <span className="block text-[10px] text-[#786c5e] mt-0.5">{p.desc}</span>
                </DrawablyButton>
              );
            })}
          </div>

          {/* Custom Duration Input */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-[#786c5e]">或自定义：</span>
            <DrawablyInput
              type="number"
              min="1"
              max="240"
              placeholder="输入分钟数 (如 35)"
              value={customMinutes}
              onChange={(e) => {
                const val = e.target.value;
                setCustomMinutes(val);
                const num = parseInt(val, 10);
                if (!isNaN(num) && num > 0) {
                  setSelectedMinutes(num);
                }
              }}
              className="w-36 !px-3 !py-1.5 text-xs bg-[var(--card)] text-[color:var(--ink)] font-mono"
            />
            <span className="text-xs text-[#786c5e]">分钟</span>
          </div>
        </div>

        {/* Custom Gentle Reminder Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#3b3127] flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#b45309]" />
              <span>到期温馨提示寄语</span>
            </label>
            <button
              type="button"
              onClick={() => {
                const nextIdx = (DEFAULT_MESSAGES.indexOf(customMessage) + 1) % DEFAULT_MESSAGES.length;
                setCustomMessage(DEFAULT_MESSAGES[nextIdx]);
              }}
              className="text-[11px] text-[#b45309] hover:underline cursor-pointer"
            >
              换一句暖心文案 ↺
            </button>
          </div>
          <textarea
            rows={2}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="输入到期提示文案..."
            className="w-full p-3 text-xs bg-[#fffdfa] border border-[#ded2bd] rounded-2xl text-[#26201a] focus:outline-[#b45309] resize-none leading-relaxed"
          />
        </div>

        {/* Audio Toggle & Sound Preview */}
        <div className="flex items-center justify-between p-3 bg-[#f7f2e7] rounded-2xl border border-[#e5dac6]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-[#b45309] text-white border-[#b45309]'
                  : 'bg-[#fffdfa] text-[#8c7e6d] border-[#ded2bd]'
              }`}
              title={soundEnabled ? '已开启温和提示音' : '已静音'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <div>
              <div className="text-xs font-bold text-[#26201a]">
                {soundEnabled ? '已启用温和风铃音效' : '仅弹窗提醒 (静音模式)'}
              </div>
              <div className="text-[10px] text-[#8c7e6d]">采用纯净和弦合成音，宁静不刺耳</div>
            </div>
          </div>

          <button
            type="button"
            onClick={playGentleChime}
            className="px-2.5 py-1 text-[11px] bg-[#fffdfa] hover:bg-[#ede4d3] border border-[#ded2bd] text-[#5c4e3f] rounded-lg transition-colors cursor-pointer"
          >
            试听音效 ♫
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#ede4d3]">
          <DrawablyButton
            tone="neutral"
            onClick={onClose}
            className="!px-4 !py-2.5 text-xs font-semibold"
          >
            关闭
          </DrawablyButton>
          <DrawablyButton
            variant="solid"
            onClick={() => handleStartTimer(selectedMinutes)}
            className="!px-5 !py-2.5 text-xs font-bold"
          >
            <span className="flex items-center gap-1.5">
              <Play className="w-4 h-4 fill-current" />
              <span>开启 {selectedMinutes} 分钟专注提醒</span>
            </span>
          </DrawablyButton>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// GENTLE REMINDER IN-PAGE ALERT POPUP MODAL
// ==========================================
interface GentleAlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onSnooze: (minutes: number) => void;
}

export const GentleAlertModal: React.FC<GentleAlertModalProps> = ({
  isOpen,
  message,
  onClose,
  onSnooze,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div
        className="bg-[#fdfbf7] rounded-3xl border-2 border-[#decfa8] max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 text-center relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Warm soothing background ambient circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Gentle Icon & Breathing Ring */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#fef3c7]/70 animate-ping opacity-75 duration-1000" />
          <div className="relative w-18 h-18 rounded-full bg-gradient-to-tr from-[#b45309] to-[#ea580c] flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
            <Coffee className="w-9 h-9 animate-in fade-in duration-500" />
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef7ea] border border-[#ebdcb9] text-[#854d0e] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
            <span>专注时光达成 · 温馨提醒</span>
          </div>

          <h3 className="font-bold text-[#26201a] text-xl font-display">
            恭喜完成本轮备考专注！
          </h3>

          <p className="text-xs sm:text-sm text-[#5c4e3f] leading-relaxed bg-[#fbf6ec] p-4 rounded-2xl border border-[#ebdcb9]">
            {message || DEFAULT_MESSAGES[0]}
          </p>
        </div>

        {/* Breathing / Stretching Micro-guide */}
        <div className="p-3 bg-[#f5efe4] rounded-2xl border border-[#ded3bd] text-left text-xs text-[#6e6153] flex items-start gap-2.5">
          <Heart className="w-4 h-4 text-[#c2410c] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#26201a]">护眼小贴士：</span>
            <span>向窗外或远处凝视 20 秒，缓缓深呼吸 3 次，让神经系统充分蓄能！</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
          <DrawablyButton
            tone="neutral"
            onClick={() => onSnooze(5)}
            className="w-full sm:w-auto flex-1 !px-4 !py-2.5 text-xs font-semibold"
          >
            <span className="flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#b45309]" />
              <span>休息 5 分钟 (稍后提醒)</span>
            </span>
          </DrawablyButton>

          <DrawablyButton
            onClick={() => onSnooze(25)}
            className="w-full sm:w-auto flex-1 !px-4 !py-2.5 text-xs font-semibold"
          >
            <span className="flex items-center justify-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-[#b45309]" />
              <span>再战 25 分钟番茄钟</span>
            </span>
          </DrawablyButton>

          <DrawablyButton
            variant="solid"
            onClick={onClose}
            className="w-full sm:w-auto !px-5 !py-2.5 text-xs font-bold"
          >
            我知道啦
          </DrawablyButton>
        </div>
      </div>
    </div>
  );
};
