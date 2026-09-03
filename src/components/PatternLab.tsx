import type React from "react";
import { useMemo, useRef, useState } from "react";
import type { Question, StudyStats, UserAnswerRecord } from "../types";
import { allQuestions } from "../data/allQuestions";
import { graphicFigureDescriptions } from "../data/graphicFigureDescriptions";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { DEMO_SPECS, renderRuleSequence } from "../figureEngine/sequence";
import {
  renderVariant,
  type RenderedVariant,
} from "../figureEngine/generators";
import type { SymmetryRule, TopologyRule } from "../figureEngine/spec";
import { sanitizeSvg } from "../../svgSanitize";
import { RAW_KNOWLEDGE_POINTS } from "../data/knowledgeTaxonomy";
import { RuleStepper } from "./lab/RuleStepper";
import { AnnotateCanvas } from "./lab/AnnotateCanvas";
import { RuleReplay } from "./lab/RuleReplay";
import { GuidedMode } from "./lab/GuidedMode";
import {
  Layers,
  RotateCw,
  Grid,
  Hash,
  Shapes,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Bot,
  Loader2,
  GraduationCap,
  X,
} from "lucide-react";
import { DrawablyButton } from "drawably/react";

type LabTab = "overlay" | "rotate" | "bitwise" | "count" | "group5";

/** 每个实验台对应的真实题型子分类（tab ⑤ 补齐考点覆盖，152/152 可达） */
const TAB_SUBCATEGORIES: Record<LabTab, string[]> = {
  overlay: ["重叠相消"],
  rotate: ["时针旋转", "位置移动"],
  bitwise: ["黑白位运算"],
  count: ["数量规律"],
  group5: ["分类分组", "对称曲直", "拓扑连接"],
};

const TAB_META: Record<
  LabTab,
  { title: string; sub: string; icon: React.ReactNode }
> = {
  overlay: {
    title: "① 重叠相消",
    sub: "去同存异 / 叠加求同",
    icon: <Layers className="w-4 h-4" />,
  },
  rotate: {
    title: "② 旋转移动",
    sub: "时针步长旋转 / 平移轨迹",
    icon: <RotateCw className="w-4 h-4" />,
  },
  bitwise: {
    title: "③ 黑白位运算",
    sub: "黑块相加规则推导",
    icon: <Grid className="w-4 h-4" />,
  },
  count: {
    title: "④ 数量规律",
    sub: "点线角面素快速计数",
    icon: <Hash className="w-4 h-4" />,
  },
  group5: {
    title: "⑤ 分组·对称·拓扑",
    sub: "分类分组 / 对称曲直 / 拓扑连接",
    icon: <Shapes className="w-4 h-4" />,
  },
};

function pickQuestion(
  tab: LabTab,
  excludeId?: string,
  override?: string,
): Question {
  let pool = override
    ? allQuestions.filter(
        (q) => q.category === "graphic" && q.subCategory === override,
      )
    : allQuestions.filter(
        (q) =>
          q.category === "graphic" &&
          TAB_SUBCATEGORIES[tab].includes(q.subCategory),
      );
  if (pool.length === 0)
    pool = allQuestions.filter((q) => q.category === "graphic");
  const candidates = excludeId ? pool.filter((q) => q.id !== excludeId) : pool;
  const src = candidates.length ? candidates : pool;
  return src[Math.floor(Math.random() * src.length)];
}

/* ---------------- 真实真题实战卡：真实题面图 + 标注工具箱 + 交互作答 + 作答后逐步重演 + AI 规律透析 ---------------- */
export const RealQuestionCard: React.FC<{
  tab: LabTab;
  subCategoryOverride?: string;
  onOpenAI?: (
    tab: "explain" | "graphic" | "variant" | "chat",
    q?: Question,
  ) => void;
  onRecordAnswer?: (record: UserAnswerRecord) => void;
  onAddMistake?: (qId: string) => void;
  onAnswered?: (correct: boolean) => void;
}> = ({
  tab,
  subCategoryOverride,
  onOpenAI,
  onRecordAnswer,
  onAddMistake,
  onAnswered,
}) => {
  const [question, setQuestion] = useState<Question>(() =>
    pickQuestion(tab, undefined, subCategoryOverride),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const questionStartRef = useRef(Date.now()); // 题内测量真实用时

  const nextQuestion = () => {
    setQuestion((prev) => pickQuestion(tab, prev.id, subCategoryOverride));
    setSelected(null);
    setRevealed(false);
    setAiAnalysis(null);
    questionStartRef.current = Date.now();
  };

  const handleAnswer = (key: string) => {
    if (revealed) return;
    setSelected(key);
    setRevealed(true);
    const isCorrect = key === question.correctAnswer;
    const timeSpentSec = Math.max(
      1,
      Math.round((Date.now() - questionStartRef.current) / 1000),
    );
    onRecordAnswer?.({
      questionId: question.id,
      userAnswer: key,
      isCorrect,
      timeSpentSec,
      answeredAt: new Date().toISOString(),
    });
    if (!isCorrect) onAddMistake?.(question.id);
    onAnswered?.(isCorrect);
  };

  const askAI = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const res = await fetch("/api/ai/graphic-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAiAnalysis(
        data.analysis || data.details || data.error || "未能生成规律透析",
      );
    } catch (e: any) {
      setAiAnalysis(`AI 分析失败: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const isCorrect = selected === question.correctAnswer;
  // 信息诚实（0.4）：无图形描述资产的题不宣称「视觉解构」
  const hasFigureDesc = !!graphicFigureDescriptions[question.id];

  return (
    <div className="bg-[#fdfbf7] rounded-2xl p-5 border border-[#b45309]/25 shadow-2xs space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#e8ded0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#b45309] text-white font-bold">
              真题实战
            </span>
            <span className="text-xs text-[#786c5e] font-medium">
              考点「{question.subCategory}」· 难度{" "}
              {question.difficulty === "easy"
                ? "基础"
                : question.difficulty === "medium"
                  ? "进阶"
                  : "挑战"}
            </span>
          </div>
          <h4 className="font-bold text-[#26201a] text-sm sm:text-base mt-1.5">
            {question.stem}
          </h4>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          {onOpenAI && (
            <button
              onClick={() => onOpenAI("graphic", question)}
              className="px-3 py-1.5 bg-[#f6efe2] hover:bg-[#ede3d3] text-[#4a3e31] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI 导师</span>
            </button>
          )}
          <button
            onClick={nextQuestion}
            className="px-3 py-1.5 bg-[#f6efe2] hover:bg-[#ede3d3] text-[#4a3e31] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>换一题</span>
          </button>
        </div>
      </div>

      {/* 真实题面图（PDF 原图）+ 标注工具箱（阶段 2，D9） */}
      {question.stemImages && question.stemImages.length > 0 && (
        <AnnotateCanvas>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.stemImages.map((src, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#e3d9c4] p-2 shadow-xs flex items-center justify-center"
              >
                <img
                  src={src}
                  alt={`题面图 ${i + 1}`}
                  className="max-w-full max-h-[280px] object-contain select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </AnnotateCanvas>
      )}

      {/* 选项：字母对应图中从上到下 */}
      <div className="space-y-2">
        <p className="text-xs text-[#8c7e6d]">
          选项按题面图中从上到下依次对应 A、B、C…，点击作答：
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {question.options.map((opt) => {
            const isSelected = selected === opt.key;
            const isCorrectOpt = question.correctAnswer === opt.key;
            let style =
              "bg-[#faf7f0] border-[#ded4bf] hover:border-[#b45309] hover:bg-[#f6efe2] text-[#26201a]";
            if (revealed) {
              if (isCorrectOpt)
                style =
                  "bg-[#edf6ee] border-[#4e9658] text-[#14532d] font-semibold";
              else if (isSelected)
                style = "bg-[#fef2f0] border-[#c2410c] text-[#991b1b]";
              else
                style =
                  "bg-[#fcfaf5] border-[#e7dece] text-[#968877] opacity-60";
            } else if (isSelected) {
              style =
                "bg-[#fef7eb] border-[#b45309] text-[#26201a] font-semibold ring-1 ring-[#b45309]";
            }
            return (
              <button
                key={opt.key}
                type="button"
                disabled={revealed}
                onClick={() => handleAnswer(opt.key)}
                className={`px-3 py-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${style}`}
              >
                <span className="w-6 h-6 rounded-full bg-[#f3ead7] flex items-center justify-center font-bold text-[#4a3e31] shrink-0">
                  {opt.key}
                </span>
                <span className="flex-1 text-left">{opt.content}</span>
                {revealed && isCorrectOpt && (
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                )}
                {revealed && isSelected && !isCorrectOpt && (
                  <XCircle className="w-4 h-4 text-[#b91c1c] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 判题反馈 + 逐步重演（先看规律怎么动，再读文字，D4）+ 官方解析 */}
      {revealed && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              isCorrect
                ? "bg-[#edf7ee] text-[#14532d] border border-[#bbf7d0]"
                : "bg-[#fef2f0] text-[#991b1b] border border-[#fecaca]"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
            ) : (
              <XCircle className="w-4 h-4 text-[#b91c1c]" />
            )}
            {isCorrect
              ? `回答正确！正确答案是 ${question.correctAnswer}`
              : `回答错误，正确答案是 ${question.correctAnswer}`}
          </div>

          <RuleReplay question={question} />

          <div className="bg-[#f8f3e8] p-4 rounded-xl border border-[#e3d8c2] text-xs leading-relaxed text-[#4a3e31]">
            <div className="font-bold text-[#26201a] mb-1.5">【官方解析】</div>
            <p className="whitespace-pre-wrap">
              {question.explanation ||
                "本题暂无官方解析，可点击下方 AI 规律透析。"}
            </p>
          </div>

          <button
            onClick={askAI}
            disabled={aiLoading}
            className="w-full px-3 py-2.5 bg-[#2c241d] hover:bg-[#3d3124] disabled:opacity-60 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {aiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4 text-[#fed7aa]" />
            )}
            <span>
              {aiLoading
                ? "AI 规律透析生成中…"
                : hasFigureDesc
                  ? "🔍 AI 规律透析（视觉解构 + 秒杀排除法）"
                  : "🔍 AI 规律透析（秒杀排除法 + 文字拆解）"}
            </span>
          </button>

          {aiAnalysis && (
            <div className="bg-[#fff8eb] p-4 rounded-xl border border-[#ebdcb9]">
              <div className="text-xs font-bold text-[#854d0e] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#b45309]" /> AI 规律透析
              </div>
              <MarkdownRenderer content={aiAnalysis} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------- 规律步进演示卡（阶段 1，D12：替换高频 4 类旧静态演示器） ---------------- */
const StepperDemo: React.FC<{ sub: string; title: string; hint: string }> = ({
  sub,
  title,
  hint,
}) => {
  const steps = useMemo(() => renderRuleSequence(DEMO_SPECS[sub]) ?? [], [sub]);
  return (
    <div className="bg-[#fdfbf7] rounded-2xl p-5 sm:p-6 border border-[#e3d9c4] shadow-xs space-y-4">
      <div className="pb-3 border-b border-[#eadecb]">
        <h3 className="font-bold text-[#26201a] text-base">
          规律演示器：{title}
        </h3>
        <p className="text-xs text-[#786c5e] mt-0.5">{hint}</p>
      </div>
      <RuleStepper steps={steps} />
    </div>
  );
};

/* ---------------- 低频类静态演示卡（对称曲直 / 拓扑连接，暂不做步进动画） ---------------- */
const StaticDemo: React.FC<{ sub: string }> = ({ sub }) => {
  const spec = useMemo((): SymmetryRule | TopologyRule => {
    if (sub === "对称曲直")
      return {
        kind: "symmetry",
        mode: "symmetry",
        seq: ["diamond", "triangle", "rect"],
        next: "line",
        correctAnswer: "B",
      };
    return {
      kind: "topology",
      counts: [1, 2, 3],
      nextCount: 4,
      correctAnswer: "D",
    };
  }, [sub]);
  const rendered: RenderedVariant = useMemo(() => renderVariant(spec), [spec]);
  const point = RAW_KNOWLEDGE_POINTS.find(
    (p) => p.category === "graphic" && p.subCategoryKeywords.includes(sub),
  );
  return (
    <div className="bg-[#fdfbf7] rounded-2xl p-5 border border-[#e3d9c4] shadow-xs space-y-3">
      <div className="pb-2 border-b border-[#eadecb]">
        <h3 className="font-bold text-[#26201a] text-sm">
          静态示例：{point?.shortName || sub}
        </h3>
        <p className="text-xs text-[#786c5e] mt-0.5">
          {point?.keyFormulaOrTip}
        </p>
      </div>
      <div className="flex items-center justify-around gap-2 p-3 rounded-xl bg-[#fcf8ef] border border-[#ebdcb9]">
        {/* pi-lens-ignore: dangerouslySetInnerHTML */}
        {rendered.stemFigures.map((f) => (
          <div
            key={f.label}
            className="w-16 h-16 bg-white rounded-lg border border-[#ded2bd]"
            dangerouslySetInnerHTML={{ __html: sanitizeSvg(f.svg) }}
          />
        ))}
        <span className="text-[#8c7e6d] font-bold text-xs">→ ?</span>
      </div>
    </div>
  );
};

interface PatternLabProps {
  onOpenAI?: (
    tab: "explain" | "graphic" | "variant" | "chat",
    q?: Question,
  ) => void;
  onRecordAnswer?: (record: UserAnswerRecord) => void;
  onAddMistake?: (qId: string) => void;
  stats: StudyStats;
}

export const PatternLab: React.FC<PatternLabProps> = ({
  onOpenAI,
  onRecordAnswer,
  onAddMistake,
  stats,
}) => {
  const [labTab, setLabTab] = useState<LabTab>("overlay");
  const [guided, setGuided] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      return localStorage.getItem("lab-guide-dismissed") === "1";
    } catch {
      return false;
    }
  });

  // 触发横幅（D10）：图推正确率 <60% 且未永久忽略
  const graphic = stats.categoryStats.graphic;
  const showBanner =
    !guided &&
    !bannerDismissed &&
    graphic.total >= 5 &&
    graphic.correct / graphic.total < 0.6;
  const dismissBanner = () => {
    setBannerDismissed(true);
    try {
      localStorage.setItem("lab-guide-dismissed", "1");
    } catch {
      /* 忽略持久化失败 */
    }
  };

  /* ---------- 1. 重叠相消演示器（保留旧件，D12） ---------- */
  const [shapeALines, setShapeALines] = useState<number[]>([1, 2, 4, 7]);
  const [shapeBLines, setShapeBLines] = useState<number[]>([2, 5, 7, 8]);
  const [overlayMode, setOverlayMode] = useState<"xor" | "union" | "intersect">(
    "xor",
  );

  const lineDefinitions: Record<
    number,
    { x1: number; y1: number; x2: number; y2: number; label: string }
  > = {
    1: { x1: 10, y1: 10, x2: 90, y2: 10, label: "上边" },
    2: { x1: 10, y1: 90, x2: 90, y2: 90, label: "下边" },
    3: { x1: 10, y1: 10, x2: 10, y2: 90, label: "左边" },
    4: { x1: 90, y1: 10, x2: 90, y2: 90, label: "右边" },
    5: { x1: 10, y1: 10, x2: 90, y2: 90, label: "主对角线" },
    6: { x1: 90, y1: 10, x2: 10, y2: 90, label: "副对角线" },
    7: { x1: 10, y1: 50, x2: 90, y2: 50, label: "中横线" },
    8: { x1: 50, y1: 10, x2: 50, y2: 90, label: "中竖线" },
  };

  const toggleLineA = (id: number) =>
    setShapeALines((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleLineB = (id: number) =>
    setShapeBLines((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const getResultLines = () => {
    if (overlayMode === "xor") {
      return Object.keys(lineDefinitions)
        .map(Number)
        .filter((id) => {
          const inA = shapeALines.includes(id);
          const inB = shapeBLines.includes(id);
          return (inA && !inB) || (!inA && inB);
        });
    }
    if (overlayMode === "union")
      return Array.from(new Set([...shapeALines, ...shapeBLines]));
    return shapeALines.filter((id) => shapeBLines.includes(id));
  };

  /* ---------- 3. 黑白位运算演示器（保留旧件，D12） ---------- */
  const [gridA, setGridA] = useState<boolean[]>([true, false, false, true]);
  const [gridB, setGridB] = useState<boolean[]>([true, true, false, false]);
  const [rules, setRules] = useState({ bb: true, bw: false, ww: true });

  const computeBitwiseResult = () =>
    [0, 1, 2, 3].map((i) => {
      const a = gridA[i];
      const b = gridB[i];
      if (a && b) return rules.bb;
      if (!a && !b) return rules.ww;
      return rules.bw;
    });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e3d9c4] shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef7ea] text-[#854d0e] text-xs font-semibold border border-[#ebdcb9] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
            <span>真题实战 + 步进动画 + 动手标注 + AI 规律透析</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#26201a] mb-2">
            复杂图形推理 · 规律动态实验室
          </h2>
          <p className="text-xs sm:text-sm text-[#786c5e] leading-relaxed">
            每类规律直接使用题库中的{" "}
            <strong className="text-[#26201a]">真实图形真题</strong>{" "}
            实战演练；
            演示器把规律「变化过程」一步步放给你看，还可在真题图上点数计数、圈选标记，答完先看规律重演再读解析。
          </p>
        </div>
        <DrawablyButton
          variant={guided ? "scribble" : "outline"}
          onClick={() => setGuided((v) => !v)}
          className="mt-4 !px-4 !py-2 text-xs font-semibold"
        >
          <span className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>{guided ? "退出新手引导" : "新手引导（预习 → 跟练 → 独立做题）"}</span>
          </span>
        </DrawablyButton>
      </div>

      {/* 正确率 <60% 触发横幅（D10，可永久忽略） */}
      {showBanner && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#fef7ea] border border-[#ebdcb9] text-xs text-[#78350f]">
          <span>
            📉 你的图推正确率目前{" "}
            {graphic.total > 0
              ? Math.round((graphic.correct / graphic.total) * 100)
              : 0}
            %（{graphic.correct}/{graphic.total}）。
            建议先用「新手引导」把高频考点的规律变化过程看一遍。
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setGuided(true)}
              className="px-3 py-1.5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-semibold cursor-pointer transition-colors"
            >
              开始引导
            </button>
            <button
              type="button"
              onClick={dismissBanner}
              className="px-2 py-1.5 rounded-lg hover:bg-[#f3e8d2] text-[#8c7e6d] cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      )}

      {guided ? (
        /* 新手引导模式（D10 三段式，走完自动回普通模式） */
        <GuidedMode
          onExit={() => setGuided(false)}
          onOpenAI={onOpenAI ?? (() => {})}
          onRecordAnswer={onRecordAnswer ?? (() => {})}
          onAddMistake={onAddMistake ?? (() => {})}
        />
      ) : (
        <>
          {/* Lab Nav Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-xs sm:text-sm">
            {(Object.keys(TAB_META) as LabTab[]).map((key) => (
              <DrawablyButton
                key={key}
                variant={labTab === key ? "scribble" : "outline"}
                onClick={() => setLabTab(key)}
                className="flex-1 min-w-fit !py-2.5 !px-3 font-semibold whitespace-nowrap"
              >
                <span className="flex items-center justify-center gap-2">
                  {TAB_META[key].icon}
                  <span>{TAB_META[key].title}</span>
                </span>
              </DrawablyButton>
            ))}
          </div>

          {/* 真实真题实战卡：key=labTab，切 tab 立即换题并清空作答态（P0 0.1） */}
          <RealQuestionCard
            key={labTab}
            tab={labTab}
            onOpenAI={onOpenAI}
            onRecordAnswer={onRecordAnswer}
            onAddMistake={onAddMistake}
          />

          {/* ============ 模块1：重叠相消演示器（旧件保留） ============ */}
          {labTab === "overlay" && (
            <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eadecb]">
                <div>
                  <h3 className="font-bold text-[#26201a] text-base">
                    规律演示器：重叠相消（去同存异）
                  </h3>
                  <p className="text-xs text-[#786c5e] mt-0.5">
                    点击图形 A / B
                    的线条开关，观察右侧叠加结果；再回到上方真题验证同一规律
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {[
                    ["xor", "去同存异"],
                    ["union", "直接叠加"],
                    ["intersect", "求同保留"],
                  ].map(([mode, label]) => (
                    <DrawablyButton
                      key={mode}
                      variant={overlayMode === mode ? "scribble" : "outline"}
                      onClick={() => setOverlayMode(mode as typeof overlayMode)}
                      className="!px-3 !py-1 font-semibold"
                    >
                      {label}
                    </DrawablyButton>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {[
                  {
                    title: "图形 A",
                    color: "#b45309",
                    lines: shapeALines,
                    toggle: toggleLineA,
                    label: "A",
                  },
                  {
                    title: "图形 B",
                    color: "#9a3412",
                    lines: shapeBLines,
                    toggle: toggleLineB,
                    label: "B",
                  },
                ].map((shape) => (
                  <div
                    key={shape.label}
                    className="md:col-span-2 flex flex-col items-center p-4 bg-[#fcf8ef] rounded-xl border border-[#ebdcb9]"
                  >
                    <span className="text-xs font-bold text-[#854d0e] mb-2">
                      图形 {shape.label}（点击线条开关）
                    </span>
                    <svg
                      viewBox="0 0 100 100"
                      className="w-40 h-40 bg-[#fffdfa] rounded-lg shadow-sm border border-[#ded2bd]"
                    >
                      <rect
                        x="10"
                        y="10"
                        width="80"
                        height="80"
                        fill="none"
                        stroke="#e8ded0"
                        strokeDasharray="3,3"
                      />
                      {Object.entries(lineDefinitions).map(([idStr, line]) => {
                        const id = Number(idStr);
                        const checked = shape.lines.includes(id);
                        return (
                          <g
                            key={id}
                            onClick={() => shape.toggle(id)}
                            className="cursor-pointer group"
                          >
                            <line
                              x1={line.x1}
                              y1={line.y1}
                              x2={line.x2}
                              y2={line.y2}
                              stroke="transparent"
                              strokeWidth="14"
                            />
                            <line
                              x1={line.x1}
                              y1={line.y1}
                              x2={line.x2}
                              y2={line.y2}
                              stroke={checked ? shape.color : "#ded2bd"}
                              strokeWidth={checked ? "4" : "2"}
                              strokeLinecap="round"
                              className="transition-colors group-hover:stroke-[#d97706]"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                ))}

                <div className="flex flex-col items-center justify-center text-[#8c7e6d] font-bold text-xl">
                  <span className="p-2 bg-[#f6efe2] rounded-full text-[#b45309] text-sm font-semibold">
                    {overlayMode === "xor"
                      ? "⊕ 相消"
                      : overlayMode === "union"
                        ? "＋ 叠加"
                        : "∩ 求同"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center p-5 bg-[#edf7ee] rounded-xl border border-[#bbf7d0]">
                <span className="text-xs font-bold text-[#14532d] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d]" />{" "}
                  运算结果图形
                </span>
                <svg
                  viewBox="0 0 100 100"
                  className="w-44 h-44 bg-[#fffdfa] rounded-xl shadow-md border-2 border-[#15803d]"
                >
                  <rect
                    x="10"
                    y="10"
                    width="80"
                    height="80"
                    fill="none"
                    stroke="#e2f0e4"
                    strokeDasharray="2,2"
                  />
                  {getResultLines().map((id) => {
                    const line = lineDefinitions[id];
                    return (
                      <line
                        key={id}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#15803d"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                <div className="mt-3 text-xs text-[#14532d] font-medium text-center">
                  {overlayMode === "xor" &&
                    "✨ 重合线段全部抵消，仅保留两图各自独有线条（真题最常见考法）。"}
                  {overlayMode === "union" && "✨ 所有出现过的线条直接合并。"}
                  {overlayMode === "intersect" &&
                    "✨ 仅显示两图共同重合的公共线段。"}
                </div>
              </div>
            </div>
          )}

          {/* ============ 模块2：旋转移动（D12：步进动画替换旧静态演示器） ============ */}
          {labTab === "rotate" && (
            <div className="space-y-6">
              <StepperDemo
                sub="时针旋转"
                title="时针旋转（步长旋转）"
                hint="看箭头以中心黑点为基准点一步步旋转；残影保留前几步位置，让轨迹可见"
              />
              <StepperDemo
                sub="位置移动"
                title="位置移动（平移轨迹）"
                hint="黑点按固定方向逐格平移，循环回卷时高亮提示；残影保留轨迹"
              />
            </div>
          )}

          {/* ============ 模块3：黑白位运算演示器（旧件保留） ============ */}
          {labTab === "bitwise" && (
            <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
              <div className="pb-3 border-b border-[#eadecb]">
                <h3 className="font-bold text-[#26201a] text-base">
                  规律演示器：黑白格位运算规则推导
                </h3>
                <p className="text-xs text-[#786c5e] mt-0.5">
                  点击格子翻转黑白并配置运算法则；再回上方真题验证“黑+黑 / 黑+白
                  / 白+白”的位运算规律
                </p>
              </div>

              <div className="p-3 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2] flex flex-wrap items-center gap-4 text-xs font-medium text-[#4a3e31]">
                <span className="font-bold text-[#26201a]">当前运算法则：</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span>黑 + 黑 =</span>
                  <select
                    value={rules.bb ? "black" : "white"}
                    onChange={(e) =>
                      setRules({ ...rules, bb: e.target.value === "black" })
                    }
                    className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold"
                  >
                    <option value="black">黑</option>
                    <option value="white">白</option>
                  </select>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span>黑 + 白 =</span>
                  <select
                    value={rules.bw ? "black" : "white"}
                    onChange={(e) =>
                      setRules({ ...rules, bw: e.target.value === "black" })
                    }
                    className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold"
                  >
                    <option value="white">白</option>
                    <option value="black">黑</option>
                  </select>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span>白 + 白 =</span>
                  <select
                    value={rules.ww ? "black" : "white"}
                    onChange={(e) =>
                      setRules({ ...rules, ww: e.target.value === "black" })
                    }
                    className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold"
                  >
                    <option value="black">黑</option>
                    <option value="white">白</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {[
                  { label: "图形 A", grid: gridA, setGrid: setGridA },
                  { label: "图形 B", grid: gridB, setGrid: setGridB },
                ].map((g) => (
                  <div
                    key={g.label}
                    className="md:col-span-2 flex flex-col items-center p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2]"
                  >
                    <span className="text-xs font-bold text-[#4a3e31] mb-2">
                      {g.label}（点击翻转黑白）
                    </span>
                    <div className="grid grid-cols-2 gap-1 w-32 h-32 p-1 bg-[#fffdfa] border border-[#ded3bd] rounded-lg">
                      {g.grid.map((isBlack, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const copy = [...g.grid];
                            copy[i] = !copy[i];
                            g.setGrid(copy);
                          }}
                          className={`rounded transition-colors cursor-pointer border ${
                            isBlack
                              ? "bg-[#26201a] border-[#26201a]"
                              : "bg-[#fffdfa] border-[#ded3bd] hover:bg-[#f6eee0]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-center text-xl font-bold text-[#8c7e6d]">
                  ＋
                </div>
              </div>

              <div className="flex flex-col items-center p-5 bg-[#fef7ea] rounded-xl border border-[#ebdcb9]">
                <span className="text-xs font-bold text-[#854d0e] mb-2">
                  运算结果
                </span>
                <div className="grid grid-cols-2 gap-1 w-32 h-32 p-1 bg-[#fffdfa] border-2 border-[#b45309] rounded-lg shadow-sm">
                  {computeBitwiseResult().map((isBlack, i) => (
                    <div
                      key={i}
                      className={`rounded ${isBlack ? "bg-[#26201a]" : "bg-[#fffdfa] border border-[#ded3bd]"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ 模块4：数量规律（D12：步进动画替换旧静态演示器） ============ */}
          {labTab === "count" && (
            <StepperDemo
              sub="数量规律"
              title="数量规律（等差递增）"
              hint="元素个数一步步 +1，变化的元素高亮、其余变暗；对照上方真题数点/数线/数面"
            />
          )}

          {/* ============ 模块5：分类分组（步进）+ 对称曲直/拓扑连接（静态） ============ */}
          {labTab === "group5" && (
            <div className="space-y-6">
              <StepperDemo
                sub="分类分组"
                title="分类分组（二分法归类）"
                hint="先点亮同组元素看清分组依据，再看两组数量互换的规律"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StaticDemo sub="对称曲直" />
                <StaticDemo sub="拓扑连接" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
