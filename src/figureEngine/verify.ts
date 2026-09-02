// 自洽验证器：按 ruleSpec 独立推导规律与正确答案，断言生成结果满足规律。
// 与 generators 分开实现推导逻辑，任何一侧的 bug 都会被交叉比对暴露。
import { parseSig, type RuleSpec } from "./spec";
import type { RenderedVariant } from "./generators";

function normAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function wrap3(value: number): number {
  return ((value % 3) + 3) % 3;
}

function gridSig(grid: (0 | 1)[][]): string {
  return grid.map((row) => row.join("")).join("/");
}

function applyOp(
  op: "and" | "or" | "xor",
  a: (0 | 1)[][],
  b: (0 | 1)[][],
): (0 | 1)[][] {
  return a.map((row, r) =>
    row.map((cell, c): 0 | 1 => {
      if (op === "and") return cell && b[r][c] ? 1 : 0;
      if (op === "or") return cell || b[r][c] ? 1 : 0;
      return cell === b[r][c] ? 0 : 1;
    }),
  );
}

const SYMMETRY_COUNT: Record<string, number> = {
  circle: 4,
  rect: 2,
  triangle: 3,
  diamond: 4,
  pentagon: 5,
  line: 1,
};

function expectedSig(rule: RuleSpec): string {
  switch (rule.kind) {
    case "count":
      return String(rule.start + 3 * rule.step);
    case "classify":
      return `${rule.countB},${rule.countA}`;
    case "rotate":
      return String(
        normAngle(rule.startDeg + 3 * rule.stepDeg * rule.direction),
      );
    case "gridOp":
      return gridSig(applyOp(rule.op, rule.gridA, rule.gridB));
    case "move":
      return `${wrap3(rule.start[0] + 3 * rule.step[0])},${wrap3(rule.start[1] + 3 * rule.step[1])}`;
    case "symmetry":
      return rule.mode === "curve-straight"
        ? rule.next === "circle"
          ? "curve"
          : "straight"
        : String(SYMMETRY_COUNT[rule.next]);
    case "topology":
      return String(rule.nextCount);
  }
}

function stemSigs(rule: RuleSpec): string[] {
  switch (rule.kind) {
    case "count":
      return [
        rule.start,
        rule.start + rule.step,
        rule.start + 2 * rule.step,
      ].map(String);
    case "classify":
      return [
        `${rule.countA},${rule.countB}`,
        `${rule.countB},${rule.countA}`,
        `${rule.countA},${rule.countB}`,
      ];
    case "rotate": {
      const step = rule.stepDeg * rule.direction;
      return [0, 1, 2].map((i) => String(normAngle(rule.startDeg + step * i)));
    }
    case "gridOp": {
      const result = applyOp(rule.op, rule.gridA, rule.gridB);
      return [gridSig(rule.gridA), gridSig(rule.gridB), gridSig(result)];
    }
    case "move":
      return [0, 1, 2].map(
        (i) =>
          `${wrap3(rule.start[0] + rule.step[0] * i)},${wrap3(rule.start[1] + rule.step[1] * i)}`,
      );
    case "symmetry":
      return rule.seq.map((shape) =>
        rule.mode === "curve-straight"
          ? shape === "circle"
            ? "curve"
            : "straight"
          : String(SYMMETRY_COUNT[shape]),
      );
    case "topology":
      return rule.counts.map(String);
  }
}

/** 返回错误信息；自洽则返回 null */
export function verifyVariant(
  rule: RuleSpec,
  rendered: RenderedVariant,
): string | null {
  const optionKeys = rendered.options.map((option) => option.key);
  if (new Set(optionKeys).size !== optionKeys.length) return "选项 key 重复";
  if (!optionKeys.includes(rule.correctAnswer))
    return "correctAnswer 不在选项 key 中";

  const expected = expectedSig(rule);
  const correctOption = rendered.options.find(
    (option) => option.key === rule.correctAnswer,
  );
  if (!correctOption?.svg) return "正确选项缺少图形";
  if (parseSig(correctOption.svg) !== expected) {
    return `正确选项不满足规律：期望 ${expected}，实际 ${parseSig(correctOption.svg)}`;
  }

  for (const option of rendered.options) {
    if (option.key === rule.correctAnswer) continue;
    if (!option.svg) return `选项 ${option.key} 缺少图形`;
    if (parseSig(option.svg) === expected)
      return `干扰项 ${option.key} 与正确选项相同`;
  }

  const stems = stemSigs(rule);
  if (rendered.stemFigures.length !== stems.length)
    return "题干图形数量与 spec 不符";
  for (let i = 0; i < stems.length; i += 1) {
    const actual = parseSig(rendered.stemFigures[i].svg);
    if (actual !== stems[i]) {
      return `题干第 ${i + 1} 图不满足规律：期望 ${stems[i]}，实际 ${actual}`;
    }
  }

  return null;
}
