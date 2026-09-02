// 步进序列渲染器：由 ruleSpec 确定性生成「规律变化过程」步进帧（高频 4 类先行）。
// 复用 spec.ts 的渲染原语，caption 措辞对齐 knowledgeTaxonomy / formulaBank 口径。
// 纯函数、无外部依赖，契约断言挂 scripts/check-figure-engine.ts。
import {
  SUB_CATEGORY_KINDS,
  SHAPE_KINDS,
  arrowFigure,
  gridFigure,
  positions,
  shapeSvg,
  svgFigure,
  type CountRule,
  type ClassifyRule,
  type RuleSpec,
  type ShapeKind,
} from "./spec";
import { RAW_KNOWLEDGE_POINTS } from "../data/knowledgeTaxonomy";
import { formulaBank } from "../data/formulaBank";

export interface StepState {
  /** 该步完整图形（figureEngine 渲染产物，根 g 带 data-sig） */
  svg: string;
  /** 「这步发生了什么」一句话（考点方法库口径） */
  caption: string;
  /** 相对上一步发生变化的元素 id（隔离高亮用） */
  changedIds?: string[];
  /** 该步是否叠加前几步残影（旋转/平移类 true） */
  ghost?: boolean;
}

const SHAPE_NAMES: Record<ShapeKind, string> = {
  circle: "圆",
  rect: "正方形",
  triangle: "三角形",
  diamond: "菱形",
  pentagon: "五边形",
  line: "线段",
};

/** 有步进序列渲染器的考点（高频 4 类，D5/D12） */
const SEQUENCE_KINDS: ReadonlySet<RuleSpec["kind"]> = new Set([
  "count",
  "classify",
  "rotate",
  "move",
]);

export function sequenceKindFor(subCategory: string): RuleSpec["kind"] | null {
  const kind = SUB_CATEGORY_KINDS[subCategory];
  return kind && SEQUENCE_KINDS.has(kind) ? kind : null;
}

/** 考点方法库口径：一句口诀（formulaBank graphic 类） */
function mindShortcutFor(subCategory: string): string {
  const point = RAW_KNOWLEDGE_POINTS.find(
    (p) =>
      p.category === "graphic" && p.subCategoryKeywords.includes(subCategory),
  );
  return point?.keyFormulaOrTip || "";
}

function normAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function wrap3(value: number): number {
  return ((value % 3) + 3) % 3;
}

function cellName(r: number, c: number): string {
  return `第${r + 1}行第${c + 1}列`;
}

// ---------- 高频 4 类适配器 ----------

function countSteps(rule: CountRule): StepState[] {
  const name = SHAPE_NAMES[rule.shape];
  const tip = mindShortcutFor("数量规律");
  const steps: StepState[] = [];
  for (let i = 0; i < 4; i += 1) {
    const n = rule.start + rule.step * i;
    const children = positions(n)
      .map(([x, y], j) => `<g id='c${j}'>${shapeSvg(rule.shape, x, y, 7)}</g>`)
      .join("");
    const changed =
      i === 0
        ? positions(n).map((_, j) => `c${j}`)
        : Array.from(
            { length: n - (rule.start + rule.step * (i - 1)) },
            (_, k) => `c${n - 1 - k}`,
          );
    const caption =
      i === 0
        ? `图1：${name}共 ${n} 个`
        : i === 3
          ? `答案：继续 +${rule.step}，共 ${n} 个 —— ${tip}`
          : `图${i + 1}：数量 +${rule.step}（${n - rule.step}→${n} 个），等差递增`;
    steps.push({
      svg: svgFigure(children, String(n)),
      caption,
      changedIds: changed,
    });
  }
  return steps;
}

function classifySteps(rule: ClassifyRule): StepState[] {
  const nameA = SHAPE_NAMES[rule.groupA];
  const nameB = SHAPE_NAMES[rule.groupB];
  const tip = mindShortcutFor("分类分组");
  const figure = (countA: number, countB: number) => {
    const total = countA + countB;
    const children = positions(total)
      .map(([x, y], i) => {
        const kind = i < countA ? rule.groupA : rule.groupB;
        return `<g id='e${i}' class='${i < countA ? "grp-a" : "grp-b"}'>${shapeSvg(kind, x, y, 7)}</g>`;
      })
      .join("");
    return {
      children,
      sig: `${countA},${countB}`,
      aIds: positions(countA).map((_, i) => `e${i}`),
      bIds: positions(total)
        .map((_, i) => `e${i}`)
        .slice(countA),
    };
  };
  const fig1 = figure(rule.countA, rule.countB);
  const fig2 = figure(rule.countB, rule.countA);
  return [
    {
      svg: svgFigure(fig1.children, fig1.sig),
      caption: `图1：${nameA}×${rule.countA} 与 ${nameB}×${rule.countB} 混排在一起`,
      changedIds: [...fig1.aIds, ...fig1.bIds],
    },
    {
      svg: svgFigure(fig1.children, fig1.sig),
      caption: `分组依据（二分法归类）：第 1 组全是「${nameA}」`,
      changedIds: fig1.aIds,
    },
    {
      svg: svgFigure(fig1.children, fig1.sig),
      caption: `第 2 组全是「${nameB}」—— ${tip}`,
      changedIds: fig1.bIds,
    },
    {
      svg: svgFigure(fig2.children, fig2.sig),
      caption: `图2：两组数量互换（${nameA}×${rule.countB}，${nameB}×${rule.countA}）`,
      changedIds: [...fig2.aIds, ...fig2.bIds],
    },
    {
      svg: svgFigure(fig2.children, fig2.sig),
      caption: `答案：继续互换 —— ${nameA}×${rule.countB}，${nameB}×${rule.countA}`,
      changedIds: [...fig2.aIds, ...fig2.bIds],
    },
  ];
}

function rotateSteps(rule: import("./spec").RotateRule): StepState[] {
  const step = rule.stepDeg * rule.direction;
  const dirText = rule.direction === 1 ? "顺时针" : "逆时针";
  const tip = mindShortcutFor("时针旋转");
  const pivot = `<g id='pivot'><circle cx='50' cy='50' r='4' fill='#000'/></g>`;
  const steps: StepState[] = [];
  for (let i = 0; i < 4; i += 1) {
    const deg = rule.startDeg + step * i;
    const children = `${pivot}<g id='arrow'>${arrowFigure(deg)}</g>`;
    const caption =
      i === 0
        ? `图1：箭头指向 ${normAngle(rule.startDeg)}°（以中心黑点为基准点）`
        : i === 3
          ? `答案：再${dirText}转 ${rule.stepDeg}° → ${normAngle(deg)}° —— ${tip}`
          : `图${i + 1}：以基准点${dirText}转 ${rule.stepDeg}° → ${normAngle(deg)}°`;
    steps.push({
      svg: svgFigure(children, String(normAngle(deg))),
      caption,
      changedIds: ["arrow"],
      ghost: true,
    });
  }
  return steps;
}

function moveSteps(rule: import("./spec").MoveRule): StepState[] {
  const [dr, dc] = rule.step;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  const dirText =
    dr === 0
      ? dc > 0
        ? "向右"
        : "向左"
      : dc === 0
        ? dr > 0
          ? "向下"
          : "向上"
        : `按向量（${dr},${dc}）`;
  const tip = mindShortcutFor("位置移动");
  const emptyGrid: (0 | 1)[][] = Array.from({ length: 3 }, () => [0, 0, 0]);
  const steps: StepState[] = [];
  for (let i = 0; i < 4; i += 1) {
    const r = wrap3(rule.start[0] + dr * i);
    const c = wrap3(rule.start[1] + dc * i);
    const wrapped =
      i > 0 && (rule.start[0] + dr * i !== r || rule.start[1] + dc * i !== c);
    const children = `${gridFigure(emptyGrid)}<g id='marker'><circle cx='${25 + c * 25}' cy='${25 + r * 25}' r='6' fill='#000'/></g>`;
    const caption =
      i === 0
        ? `图1：黑点位于${cellName(rule.start[0], rule.start[1])}`
        : i === 3
          ? `答案：继续${dirText}平移${len > 1 ? ` ${len} 格` : "一格"} → ${cellName(r, c)} —— ${tip}`
          : `图${i + 1}：黑点${dirText}平移${len > 1 ? ` ${len} 格` : "一格"} → ${cellName(r, c)}${wrapped ? "（越过边界循环回卷）" : ""}`;
    steps.push({
      svg: svgFigure(children, `${r},${c}`),
      caption,
      changedIds: ["marker"],
      ghost: true,
    });
  }
  return steps;
}

/** 由 ruleSpec 生成步进序列；仅支持高频 4 类，其余返回 null（优雅降级） */
export function renderRuleSequence(spec: RuleSpec): StepState[] | null {
  switch (spec.kind) {
    case "count":
      return countSteps(spec);
    case "classify":
      return classifySteps(spec);
    case "rotate":
      return rotateSteps(spec);
    case "move":
      return moveSteps(spec);
    default:
      return null;
  }
}

/** 演示器 / 引导模式共用的固定示例 spec（确定性渲染） */
export const DEMO_SPECS: Record<string, RuleSpec> = {
  数量规律: {
    kind: "count",
    shape: "circle",
    start: 2,
    step: 1,
    correctAnswer: "A",
  },
  分类分组: {
    kind: "classify",
    groupA: "circle",
    groupB: "triangle",
    countA: 2,
    countB: 1,
    correctAnswer: "A",
  },
  时针旋转: {
    kind: "rotate",
    startDeg: 0,
    stepDeg: 45,
    direction: 1,
    correctAnswer: "A",
  },
  位置移动: { kind: "move", start: [0, 0], step: [0, 1], correctAnswer: "A" },
};

/** 为真题位图生成同考点示意动画 spec（D11：随机 seed，仅高频 4 类） */
export function randomSpecFor(subCategory: string): RuleSpec | null {
  const pick = <T>(arr: readonly T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];
  const int = (min: number, max: number) =>
    min + Math.floor(Math.random() * (max - min + 1));
  switch (sequenceKindFor(subCategory)) {
    case "count":
      return {
        kind: "count",
        shape: pick(SHAPE_KINDS),
        start: int(1, 3),
        step: int(1, 2),
        correctAnswer: "A",
      };
    case "classify": {
      const a = pick(SHAPE_KINDS);
      const b = pick(SHAPE_KINDS.filter((s) => s !== a));
      return {
        kind: "classify",
        groupA: a,
        groupB: b,
        countA: int(1, 3),
        countB: int(1, 3),
        correctAnswer: "A",
      };
    }
    case "rotate":
      return {
        kind: "rotate",
        startDeg: int(0, 23) * 15,
        stepDeg: pick([15, 30, 45, 90] as const),
        direction: Math.random() < 0.5 ? 1 : -1,
        correctAnswer: "A",
      };
    case "move": {
      const start: [number, number] = [int(0, 2), int(0, 2)];
      const dr = int(-1, 1);
      let dc = int(-1, 1);
      if (dr === 0 && dc === 0) dc = 1;
      return { kind: "move", start, step: [dr, dc], correctAnswer: "A" };
    }
    default:
      return null;
  }
}
