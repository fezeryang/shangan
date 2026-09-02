// 规律步进器（plan 2.1）：默认步进、可切自动播放（播完停在末帧）、残影、隔离高亮、
// aria-live 朗读 caption、prefers-reduced-motion 降级。动效 = CSS transition + motion 渐隐（D6）。
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import type { StepState } from "../../figureEngine/sequence";
import { sanitizeSvg } from "../../../svgSanitize";

const AUTOPLAY_MS = 1600; // 每步停留 ≥1.2s（E2/E3）
const GHOST_LAYERS = 2; // 残影最多叠加前 2 步

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** 标记当前步变化元素（class）并过清洗器（信任边界：任何注入 DOM 的 svg 必须经 sanitizeSvg） */
function markChanged(svg: string, changedIds?: string[]): string {
  let out = svg;
  if (changedIds?.length) {
    for (const id of changedIds) {
      out = out.replace(`<g id='${id}'`, `<g id='${id}' class='rs-changed'`);
    }
  }
  return sanitizeSvg(out);
}

interface RuleStepperProps {
  steps: StepState[];
  /** 初始模式：默认 stepper；autoplay 播完停在末帧可回看（D3） */
  mode?: "stepper" | "autoplay";
  onStepChange?: (index: number) => void;
}

export const RuleStepper: React.FC<RuleStepperProps> = ({
  steps,
  mode = "stepper",
  onStepChange,
}) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(
    mode === "autoplay" && !prefersReducedMotion(),
  );
  const step = steps[index];
  const last = index >= steps.length - 1;
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  // autoplay：每步停留 ≥1.2s，到末帧停住（不循环，E2）
  useEffect(() => {
    if (!playing) return;
    if (last) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(
      () => setIndex((i) => Math.min(i + 1, steps.length - 1)),
      AUTOPLAY_MS,
    );
    return () => clearTimeout(timer);
  }, [playing, index, last, steps.length]);

  useEffect(() => {
    onStepChangeRef.current?.(index);
  }, [index]);

  const ghosts = useMemo(() => {
    if (!step?.ghost) return [];
    const out: { svg: string; opacity: number }[] = [];
    for (let k = 1; k <= GHOST_LAYERS && index - k >= 0; k += 1) {
      out.push({ svg: steps[index - k].svg, opacity: 0.26 - 0.08 * (k - 1) });
    }
    return out;
  }, [index, steps, step?.ghost]);

  if (!step) return null;

  const goTo = (i: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(i, steps.length - 1)));
  };

  return (
    <div className="rule-stepper space-y-3">
      <style>{`
        .rs-figure g { transition: opacity .35s ease; }
        .rs-dim > svg g:not(.rs-changed) { opacity: .3; }
        .rs-changed { animation: rs-flash .9s ease-out 1; }
        @keyframes rs-flash {
          0% { filter: none; }
          40% { filter: drop-shadow(0 0 5px rgba(180,83,9,.95)) drop-shadow(0 0 2px rgba(180,83,9,.9)); }
          100% { filter: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rs-figure g { transition: none; }
          .rs-changed { animation: none; }
        }
      `}</style>

      {/* 图形区：当前帧 + 残影叠加 */}
      <div className="relative flex items-center justify-center p-4 bg-[#fcf8ef] rounded-xl border border-[#ebdcb9]">
        <div className="rs-figure relative w-44 h-44 sm:w-52 sm:h-52">
          {ghosts.map((ghost, i) => (
            <div
              key={i}
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: ghost.opacity }}
              aria-hidden="true"
              // pi-lens-ignore: dangerouslySetInnerHTML
              dangerouslySetInnerHTML={{ __html: sanitizeSvg(ghost.svg) }}
            />
          ))}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className={`absolute inset-0 rs-svg ${step.changedIds?.length ? "rs-dim" : ""}`}
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion() ? 0 : 0.3 }}
              role="img"
              aria-label={step.caption}
              dangerouslySetInnerHTML={{
                __html: markChanged(step.svg, step.changedIds),
              }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* 步序指示 + caption（aria-live 朗读） */}
      <div className="min-h-[3rem] px-3 py-2 bg-[#fff8eb] rounded-xl border border-[#ebdcb9] text-xs leading-relaxed text-[#78350f]">
        <span className="font-bold text-[#854d0e] mr-1.5">
          第 {index + 1}/{steps.length} 步
        </span>
        <span aria-live="polite">{step.caption}</span>
      </div>

      {/* 控制条：上一步/播放/下一步/重置，全部原生 button */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="px-3 py-1.5 rounded-lg bg-[#f6efe2] hover:bg-[#ede3d3] disabled:opacity-40 text-xs font-semibold text-[#4a3e31] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> 上一步
        </button>
        <button
          type="button"
          onClick={() =>
            playing
              ? setPlaying(false)
              : last
                ? (goTo(0), setPlaying(true))
                : setPlaying(true)
          }
          disabled={prefersReducedMotion() && !playing}
          title={
            prefersReducedMotion()
              ? "已跟随系统减少动态效果"
              : "自动播放（播完停在末帧）"
          }
          className="px-3 py-1.5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
        >
          {playing ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          {playing ? "暂停" : last ? "重播" : "自动播放"}
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={last}
          className="px-3 py-1.5 rounded-lg bg-[#f6efe2] hover:bg-[#ede3d3] disabled:opacity-40 text-xs font-semibold text-[#4a3e31] flex items-center gap-1 cursor-pointer transition-colors"
        >
          下一步 <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(0)}
          className="px-2.5 py-1.5 rounded-lg text-[#8c7e6d] hover:text-[#26201a] hover:bg-[#f6efe2] cursor-pointer transition-colors"
          title="重置到第一步"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
