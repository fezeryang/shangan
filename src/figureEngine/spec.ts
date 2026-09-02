// 图推变式 spec → renderer 引擎：模型只输出规律参数与文字，图形与正确性由代码闭环。
// 8 类 subCategory 全覆盖；纯函数、无外部依赖，可进 npm test。

export type ShapeKind =
  | "circle"
  | "rect"
  | "triangle"
  | "diamond"
  | "pentagon"
  | "line";

export type RuleSpec =
  | CountRule
  | ClassifyRule
  | RotateRule
  | GridOpRule
  | MoveRule
  | SymmetryRule
  | TopologyRule;

export interface CountRule {
  kind: "count";
  shape: ShapeKind;
  start: number;
  step: number;
  correctAnswer: string;
}

export interface ClassifyRule {
  kind: "classify";
  groupA: ShapeKind;
  groupB: ShapeKind;
  countA: number;
  countB: number;
  correctAnswer: string;
}

export interface RotateRule {
  kind: "rotate";
  startDeg: number;
  stepDeg: number;
  direction: 1 | -1;
  correctAnswer: string;
}

export interface GridOpRule {
  kind: "gridOp";
  op: "and" | "or" | "xor";
  gridA: (0 | 1)[][];
  gridB: (0 | 1)[][];
  correctAnswer: string;
}

export interface MoveRule {
  kind: "move";
  start: [number, number];
  step: [number, number];
  correctAnswer: string;
}

export interface SymmetryRule {
  kind: "symmetry";
  mode: "symmetry" | "curve-straight";
  seq: ShapeKind[];
  next: ShapeKind;
  correctAnswer: string;
}

export interface TopologyRule {
  kind: "topology";
  counts: number[];
  nextCount: number;
  correctAnswer: string;
}

/** subCategory → spec kind（重叠相消复用网格位运算的确定性渲染） */
export const SUB_CATEGORY_KINDS: Record<string, RuleSpec["kind"]> = {
  数量规律: "count",
  分类分组: "classify",
  时针旋转: "rotate",
  黑白位运算: "gridOp",
  重叠相消: "gridOp",
  位置移动: "move",
  对称曲直: "symmetry",
  拓扑连接: "topology",
};

export const SHAPE_KINDS: ShapeKind[] = [
  "circle",
  "rect",
  "triangle",
  "diamond",
  "pentagon",
  "line",
];

// ---------- 参数范围校验（模型输出不可信，渲染前必须把关） ----------

function isInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

function isGrid(value: unknown): value is (0 | 1)[][] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (row) =>
        Array.isArray(row) &&
        row.length === 3 &&
        row.every((cell) => cell === 0 || cell === 1),
    )
  );
}

function isAnswerKey(value: unknown): value is string {
  return typeof value === "string" && /^[A-E]$/.test(value);
}

/** 返回错误信息；合法返回 null */
export function validateRuleSpec(spec: unknown): string | null {
  if (!spec || typeof spec !== "object") return "ruleSpec 必须是对象";
  const rule = spec as Record<string, unknown>;
  const fail = (msg: string) => msg;

  switch (rule.kind) {
    case "count": {
      const r = spec as CountRule;
      if (!SHAPE_KINDS.includes(r.shape)) return fail("count.shape 非法");
      if (!isInt(r.start) || r.start < 1 || r.start > 4)
        return fail("count.start 须为 1~4 整数");
      if (!isInt(r.step) || r.step < 1 || r.step > 3)
        return fail("count.step 须为 1~3 整数");
      if (!isAnswerKey(r.correctAnswer)) return fail("correctAnswer 非法");
      return null;
    }
    case "classify": {
      const r = spec as ClassifyRule;
      if (!SHAPE_KINDS.includes(r.groupA) || !SHAPE_KINDS.includes(r.groupB))
        return fail("classify 分组形状非法");
      if (r.groupA === r.groupB) return fail("classify 两组形状不能相同");
      if (!isInt(r.countA) || r.countA < 1 || r.countA > 3)
        return fail("countA 须为 1~3 整数");
      if (!isInt(r.countB) || r.countB < 1 || r.countB > 3)
        return fail("countB 须为 1~3 整数");
      if (!isAnswerKey(r.correctAnswer)) return fail("correctAnswer 非法");
      return null;
    }
    case "rotate": {
      const r = spec as RotateRule;
      if (!isInt(r.startDeg) || r.startDeg < 0 || r.startDeg > 359)
        return fail("startDeg 须为 0~359 整数");
      if (![15, 30, 45, 60, 90].includes(r.stepDeg))
        return fail("stepDeg 须为 15/30/45/60/90");
      if (r.direction !== 1 && r.direction !== -1)
        return fail("direction 须为 1 或 -1");
      if (!isAnswerKey(r.correctAnswer)) return fail("correctAnswer 非法");
      return null;
    }
    case "gridOp": {
      const r = spec as GridOpRule;
      if (!["and", "or", "xor"].includes(r.op)) return fail("op 非法");
      if (!isGrid(r.gridA) || !isGrid(r.gridB))
        return fail("grid 必须是 3×3 的 0/1 矩阵");
      if (!isAnswerKey(r.correctAnswer)) return fail("correctAnswer 非法");
      return null;
    }
    case "move": {
      const r = spec as MoveRule;
      if (
        !Array.isArray(r.start) ||
        r.start.length !== 2 ||
        !isInt(r.start[0]) ||
        !isInt(r.start[1])
      )
        return fail("start 须为 [r,c] 整数坐标");
      if (
        !Array.isArray(r.step) ||
        r.step.length !== 2 ||
        !isInt(r.step[0]) ||
        !isInt(r.step[1])
      )
        return fail("step 须为 [dr,dc] 整数向量");
      if (r.step[0] === 0 && r.step[1] === 0) return fail("step 不能为 0");
      if (
        r.start.some((v) => v < 0 || v > 2) ||
        r.step.some((v) => v < -2 || v > 2)
      )
        return fail("坐标分量须在 -2~2 且起点在 0~2");
      if (!isAnswerKey(r.correctAnswer)) return fail("correctAnswer 非法");
      return null;
    }
    case "symmetry": {
      const r = spec as SymmetryRule;
      if (r.mode !== "symmetry" && r.mode !== "curve-straight")
        return fail("mode 非法");
      if (
        !Array.isArray(r.seq) ||
        r.seq.length !== 3 ||
        r.seq.some((s) => !SHAPE_KINDS.includes(s))
      )
        return fail("seq 须为 3 个合法形状");
      if (!SHAPE_KINDS.includes(r.next)) return fail("next 形状非法");
      if (!isAnswerKey(r.correctAnswer)) return fail("correctAnswer 非法");
      return null;
    }
    case "topology": {
      const r = spec as TopologyRule;
      if (
        !Array.isArray(r.counts) ||
        r.counts.length !== 3 ||
        !r.counts.every((c) => isInt(c) && c >= 1 && c <= 4)
      )
        return fail("counts 须为 3 个 1~4 的整数");
      if (!isInt(r.nextCount) || r.nextCount < 1 || r.nextCount > 4)
        return fail("nextCount 须为 1~4 整数");
      if (!isAnswerKey(r.correctAnswer)) return fail("correctAnswer 非法");
      return null;
    }
    default:
      return fail(`未知 kind: ${String(rule.kind)}`);
  }
}

// ---------- 共享 SVG 渲染原语（输出均为单引号属性，保证 JSON 合法） ----------

function polygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  startDeg = -90,
): string {
  const points: string[] = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = ((startDeg + (360 / sides) * i) * Math.PI) / 180;
    points.push(
      `${Math.round(cx + radius * Math.cos(angle))},${Math.round(cy + radius * Math.sin(angle))}`,
    );
  }
  return points.join(" ");
}

export function shapeSvg(
  kind: ShapeKind,
  cx: number,
  cy: number,
  size: number,
): string {
  const stroke = "stroke='#000' stroke-width='3'";
  switch (kind) {
    case "circle":
      return `<circle cx='${cx}' cy='${cy}' r='${size}' fill='none' ${stroke}/>`;
    case "rect":
      return `<rect x='${cx - size}' y='${cy - size}' width='${size * 2}' height='${size * 2}' fill='none' ${stroke}/>`;
    case "triangle":
      return `<polygon points='${polygonPoints(cx, cy, size, 3)}' fill='none' ${stroke}/>`;
    case "diamond":
      return `<polygon points='${polygonPoints(cx, cy, size, 4)}' fill='none' ${stroke}/>`;
    case "pentagon":
      return `<polygon points='${polygonPoints(cx, cy, size, 5)}' fill='none' ${stroke}/>`;
    case "line":
      return `<line x1='${cx - size}' y1='${cy}' x2='${cx + size}' y2='${cy}' ${stroke}/>`;
  }
}

/** 每行最多 4 个，最多 8 个的分布坐标 */
export function positions(count: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < count; i += 1) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    out.push([18 + col * 22, 24 + row * 30]);
  }
  return out;
}

/** 3×3 网格图；fill=1 的格子涂黑，可选标记点（位置移动用） */
export function gridFigure(
  cells: (0 | 1)[][],
  mark?: [number, number],
): string {
  const parts: string[] = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      const x = 14 + c * 25;
      const y = 14 + r * 25;
      parts.push(
        `<rect x='${x}' y='${y}' width='22' height='22' fill='${cells[r][c] ? "#000" : "#fff"}' stroke='#000' stroke-width='2'/>`,
      );
    }
  }
  if (mark) {
    parts.push(
      `<circle cx='${25 + mark[1] * 25}' cy='${25 + mark[0] * 25}' r='6' fill='#000'/>`,
    );
  }
  return parts.join("");
}

export function arrowFigure(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  return `<g transform='rotate(${normalized} 50 50)'><line x1='50' y1='50' x2='50' y2='24' stroke='#000' stroke-width='4'/><polygon points='50,12 43,26 57,26' fill='#000'/></g>`;
}

/** 机器可读签名内嵌在根 g 上：验证器用它独立比对，不依赖图形渲染细节 */
export function svgFigure(children: string, sig: string): string {
  return `<svg viewBox='0 0 100 100'><g data-sig='${sig}'>${children}</g></svg>`;
}

export function parseSig(svg: string): string | null {
  const match = /data-sig='([^']*)'/.exec(svg || "");
  return match ? match[1] : null;
}
