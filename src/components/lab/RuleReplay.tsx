// 作答后逐步重演（plan 2.4，D4/D11）：置于官方解析文字之前——先看规律怎么动，再读文字。
// 引擎图形题（stemFigures，AI 变式）真实回放；真题位图播同考点示意动画并诚实标注「非本题原图」；
// 无序列渲染器的考点（低频 4 类）优雅降级为 null。
import React, { useMemo } from "react";
import { RefreshCcw } from "lucide-react";
import type { AIQuestion, Question } from "../../types";
import {
  randomSpecFor,
  renderRuleSequence,
  type StepState,
} from "../../figureEngine/sequence";
import { RuleStepper } from "./RuleStepper";

function replaySteps(
  question: Question | AIQuestion,
): { steps: StepState[]; schematic: boolean } | null {
  // 引擎图形题（AI 变式）：题面 stemFigures + 正确选项构造 steps，真实回放
  if (
    "stemFigures" in question &&
    question.stemFigures &&
    question.stemFigures.length >= 2
  ) {
    const correctSvg = question.options.find(
      (o) => o.key === question.correctAnswer,
    )?.svg;
    const steps: StepState[] = question.stemFigures.map((f) => ({
      svg: f.svg,
      caption: `题面 ${f.label}：观察规律如何一步步呈现`,
      changedIds: [],
    }));
    if (correctSvg)
      steps.push({
        svg: correctSvg,
        caption: `答案（${question.correctAnswer}）：延续同一规律`,
        changedIds: [],
      });
    return { steps, schematic: false };
  }
  // 真题位图：同考点示意动画（引擎渲染）
  const spec = randomSpecFor(question.subCategory);
  if (!spec) return null;
  const steps = renderRuleSequence(spec);
  return steps ? { steps, schematic: true } : null;
}

export const RuleReplay: React.FC<{ question: Question | AIQuestion }> = ({
  question,
}) => {
  const replay = useMemo(() => replaySteps(question), [question.id]);
  if (!replay) return null;
  return (
    <div className="p-4 rounded-xl border border-[#d8e3f5] bg-[#f6f9ff] space-y-3">
      <div className="text-xs font-bold text-[#1e40af] flex items-center gap-1.5">
        <RefreshCcw className="w-3.5 h-3.5 text-[#3b82f6]" />
        {replay.schematic
          ? "🔄 同考点规律重演（示意，非本题原图）"
          : "🔄 本题规律逐步重演"}
      </div>
      {replay.schematic && (
        <p className="text-[11px] text-[#64748b] -mt-1">
          下方动画由规律引擎按考点「{question.subCategory}
          」演示同样的变化过程，帮助看清规律；图形与本题原题无关。
        </p>
      )}
      <RuleReplayStepper steps={replay.steps} />
    </div>
  );
};

/** 每题换一个示意 spec：steps 变化时重置步进器 */
const RuleReplayStepper: React.FC<{ steps: StepState[] }> = ({ steps }) => {
  const [resetKey, setResetKey] = React.useState(0);
  React.useEffect(() => setResetKey((k) => k + 1), [steps]);
  return <RuleStepper key={resetKey} steps={steps} />;
};
