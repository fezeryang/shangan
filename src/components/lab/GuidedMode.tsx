// 新手引导模式（plan 2.5，D10）：预习卡 → 分步跟练 → 独立做题，支架渐退（E5）。
// 内容不新造：预习卡文字取自 knowledgeTaxonomy / formulaBank；跟练复用 RuleStepper；独立做题复用 RealQuestionCard。
// 进度存 localStorage `lab-guide-done:{subCategory}`，走完自动回普通模式。
import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Footprints,
  PenLine,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import type { Question, UserAnswerRecord } from "../../types";
import { RAW_KNOWLEDGE_POINTS } from "../../data/knowledgeTaxonomy";
import { formulaBank } from "../../data/formulaBank";
import { DEMO_SPECS, renderRuleSequence } from "../../figureEngine/sequence";
import { renderVariant } from "../../figureEngine/generators";
import { sanitizeSvg } from "../../../svgSanitize";
import { RuleStepper } from "./RuleStepper";
import { RealQuestionCard } from "../PatternLab";
import { DrawablyButton } from "drawably/react";

/** 引导覆盖的考点 = 有步进序列的高频 4 类 */
export const GUIDE_SUBCATEGORIES = Object.keys(DEMO_SPECS);

const doneKey = (sub: string) => `lab-guide-done:${sub}`;

export function isGuideDone(sub: string): boolean {
  try {
    return localStorage.getItem(doneKey(sub)) === "1";
  } catch {
    return false;
  }
}

/** 预习卡内容：taxonomy + formulaBank 口径 */
function guideContent(sub: string) {
  const point = RAW_KNOWLEDGE_POINTS.find(
    (p) => p.category === "graphic" && p.subCategoryKeywords.includes(sub),
  );
  const formula = formulaBank.find(
    (f) =>
      f.category === "graphic" &&
      (f.tags.some((t) => point?.subCategoryKeywords.includes(t)) ||
        f.title.includes(point?.shortName || "??")),
  );
  return {
    name: point?.name || sub,
    look: point?.description || "",
    order: point?.keyFormulaOrTip || "",
    mantra: formula?.mindShortcut || point?.keyFormulaOrTip || "",
  };
}

interface GuidedModeProps {
  onExit: () => void;
  onOpenAI: (
    tab: "explain" | "graphic" | "variant" | "chat",
    q?: Question,
  ) => void;
  onRecordAnswer: (record: UserAnswerRecord) => void;
  onAddMistake: (qId: string) => void;
}

export const GuidedMode: React.FC<GuidedModeProps> = ({
  onExit,
  onOpenAI,
  onRecordAnswer,
  onAddMistake,
}) => {
  const [sub, setSub] = useState<string | null>(null);
  const [stage, setStage] = useState<"preview" | "follow" | "solo">("preview");
  const [followDone, setFollowDone] = useState(false); // 跟练走到末步才放行（E5 样例学习）
  const [finished, setFinished] = useState(false);

  const content = useMemo(() => (sub ? guideContent(sub) : null), [sub]);
  const example = useMemo(
    () => (sub ? renderVariant(DEMO_SPECS[sub]) : null),
    [sub],
  );
  const steps = useMemo(
    () => (sub ? renderRuleSequence(DEMO_SPECS[sub]) : null),
    [sub],
  );

  const selectSub = (s: string) => {
    setSub(s);
    setStage("preview");
    setFollowDone(false);
    setFinished(false);
  };

  const complete = (s: string) => {
    try {
      localStorage.setItem(doneKey(s), "1");
    } catch {
      /* 进度持久化失败不影响当次引导 */
    }
    setFinished(true);
  };

  return (
    <div className="bg-[#fdfbf7] rounded-2xl p-5 sm:p-6 border border-[#b45309]/40 shadow-xs space-y-5">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#e8ded0]">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#b45309] text-white flex items-center justify-center">
            <GraduationCap className="w-4.5 h-4.5" />
          </span>
          <div>
            <h3 className="font-bold text-[#26201a] text-sm sm:text-base">
              新手引导模式
            </h3>
            <p className="text-[11px] text-[#8c7e6d]">
              预习 → 跟练 → 独立做题，走完自动回到普通模式
            </p>
          </div>
        </div>
        <DrawablyButton
          tone="neutral"
          onClick={onExit}
          className="!px-3 !py-1.5 text-xs font-semibold"
        >
          退出引导
        </DrawablyButton>
      </div>

      {/* 考点选择 */}
      {!sub && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GUIDE_SUBCATEGORIES.map((s) => {
            const c = guideContent(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => selectSub(s)}
                className="text-left p-4 rounded-xl border border-[#ded3bd] bg-[#fcf8ef] hover:border-[#b45309] hover:bg-[#fef7ea] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#26201a] text-sm">
                    {c.name}
                  </span>
                  {isGuideDone(s) && (
                    <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
                  )}
                </div>
                <p className="text-[11px] text-[#786c5e] mt-1.5 leading-relaxed">
                  {c.look}
                </p>
                <p className="text-[10px] text-[#b45309] mt-2">
                  {isGuideDone(s)
                    ? "✓ 已完成，可再练一轮"
                    : "点击开始三段式引导"}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* 三段进度指示 */}
      {sub && !finished && (
        <div className="flex items-center gap-2 text-[11px] font-semibold">
          {(
            [
              ["preview", "① 预习卡", BookOpen],
              ["follow", "② 分步跟练", Footprints],
              ["solo", "③ 独立做题", PenLine],
            ] as const
          ).map(([key, label, Icon]) => (
            <React.Fragment key={key}>
              <span
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  stage === key
                    ? "bg-[#b45309] text-white"
                    : stageDone(stage, key)
                      ? "bg-[#edf7ee] text-[#14532d]"
                      : "bg-[#f6efe2] text-[#8c7e6d]"
                }`}
              >
                <Icon className="w-3 h-3" /> {label}
              </span>
              {key !== "solo" && <span className="text-[#c9bda9]">→</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* 阶段 1：预习卡（静态） */}
      {sub && content && stage === "preview" && !finished && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#f8f3e8] border border-[#e3d8c2] space-y-3">
            <div>
              <div className="text-xs font-bold text-[#854d0e] mb-1">
                这个考点在考什么
              </div>
              <p className="text-xs text-[#4a3e31] leading-relaxed">
                {content.look}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-[#854d0e] mb-1">
                先看什么、按什么顺序排查
              </div>
              <p className="text-xs text-[#4a3e31] leading-relaxed">
                {content.order}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-[#854d0e] mb-1">
                一句口诀
              </div>
              <p className="text-xs text-[#78350f] leading-relaxed bg-[#fef7ea] border border-[#ebdcb9] rounded-lg px-3 py-2">
                「{content.mantra}」
              </p>
            </div>
          </div>
          {example && (
            <div>
              <div className="text-xs font-bold text-[#4a3e31] mb-2">
                最简示例（规律示意，非真题）
              </div>
              <div className="flex items-center justify-around gap-2 p-3 rounded-xl bg-[#fcf8ef] border border-[#ebdcb9]">
                {example.stemFigures.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col items-center gap-1"
                  >
                    {/* pi-lens-ignore: dangerouslySetInnerHTML */}
                    <div
                      className="w-20 h-20 bg-white rounded-lg border border-[#ded2bd]"
                      dangerouslySetInnerHTML={{ __html: sanitizeSvg(f.svg) }}
                    />
                    <span className="text-[10px] text-[#8c7e6d]">
                      {f.label}
                    </span>
                  </div>
                ))}
                <span className="text-[#8c7e6d] font-bold text-xs">→ ?</span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <DrawablyButton
              tone="neutral"
              onClick={() => setSub(null)}
              className="!px-3 !py-1.5 text-xs font-semibold"
            >
              <span className="flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> 换考点</span>
            </DrawablyButton>
            <DrawablyButton
              variant="solid"
              onClick={() => setStage("follow")}
              className="!px-4 !py-1.5 text-xs font-semibold"
            >
              下一步：分步跟练 →
            </DrawablyButton>
          </div>
        </div>
      )}

      {/* 阶段 2：分步跟练（RuleStepper 复用 + 引导文案） */}
      {sub && stage === "follow" && !finished && steps && (
        <div className="space-y-4">
          <p className="text-xs text-[#786c5e] leading-relaxed">
            下面把「{guideContent(sub).name}」的变化过程一步步放给你看：用{" "}
            <strong>下一步</strong> 逐帧走完，
            每步读一句「这步发生了什么」，走完末步即可进入独立做题。
          </p>
          <RuleStepper
            steps={steps}
            mode="autoplay"
            onStepChange={(i) => i >= steps.length - 1 && setFollowDone(true)}
          />
          <div className="flex justify-end gap-2">
            <DrawablyButton
              tone="neutral"
              onClick={() => setStage("preview")}
              className="!px-3 !py-1.5 text-xs font-semibold"
            >
              回看预习卡
            </DrawablyButton>
            <DrawablyButton
              variant="solid"
              onClick={() => setStage("solo")}
              disabled={!followDone}
              title={followDone ? undefined : "请先逐帧走到末步"}
              className="!px-4 !py-1.5 text-xs font-semibold"
            >
              {followDone ? "下一步：独立做题 →" : "走完跟练后解锁"}
            </DrawablyButton>
          </div>
        </div>
      )}

      {/* 阶段 3：独立做题（复用 RealQuestionCard，支架撤除） */}
      {sub && stage === "solo" && !finished && (
        <div className="space-y-3">
          <p className="text-xs text-[#786c5e]">
            现在不看动画，用刚才的排查顺序独立做真题 ——
            答对任意一题即完成本考点引导。
          </p>
          <RealQuestionCard
            key={`guided-${sub}`}
            tab="count"
            subCategoryOverride={sub}
            onOpenAI={onOpenAI}
            onRecordAnswer={onRecordAnswer}
            onAddMistake={onAddMistake}
            onAnswered={(correct) => correct && complete(sub)}
          />
        </div>
      )}

      {/* 完成卡片：自动回普通模式 */}
      {finished && sub && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-[#15803d]" />
          <div>
            <div className="font-bold text-[#14532d] text-sm">
              「{guideContent(sub).name}」引导完成！
            </div>
            <p className="text-xs text-[#786c5e] mt-1">
              支架已撤除，回到普通模式继续实战；后续可在实验室随时回看演示器。
            </p>
          </div>
          <DrawablyButton
            variant="solid"
            onClick={onExit}
            className="!px-4 !py-2 text-xs font-semibold"
          >
            返回普通模式
          </DrawablyButton>
        </div>
      )}
    </div>
  );
};

/** 三段进度是否已过（preview < follow < solo） */
function stageDone(
  current: "preview" | "follow" | "solo",
  key: "preview" | "follow" | "solo",
): boolean {
  const order = { preview: 0, follow: 1, solo: 2 };
  return order[key] < order[current];
}
