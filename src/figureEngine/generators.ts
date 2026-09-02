// 参数化生成器：由 ruleSpec 确定性渲染 stemFigures 序列 + 正确选项 + 结构化干扰项。
// 正确选项放在 correctAnswer 指定位，其余位置按「默认干扰项公式」顺序填充。
import {
  arrowFigure,
  gridFigure,
  parseSig,
  positions,
  shapeSvg,
  svgFigure,
  type GridOpRule,
  type RuleSpec,
  type ShapeKind,
  type SymmetryRule,
} from "./spec";

export interface RenderedOption {
  key: string;
  content: string;
  svg: string;
}

export interface RenderedVariant {
  stemFigures: { label: string; svg: string }[];
  options: RenderedOption[];
}

const STEM_LABELS = ["图1", "图2", "图3"];

function normAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function gridSig(grid: number[][]): string {
  return grid.map((row) => row.join("")).join("/");
}

function wrap3(value: number): number {
  return ((value % 3) + 3) % 3;
}

function dedupeNumbers(values: number[], excluded: number): number[] {
  const seen = new Set<number>([excluded]);
  const out: number[] = [];
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      out.push(value);
    }
  }
  return out.slice(0, 3);
}

function assembleOptions(
  correctAnswer: string,
  optionCount: number,
  correctSvg: string,
  distractorSvgs: string[],
): RenderedOption[] {
  const keys = Array.from({ length: optionCount }, (_, i) =>
    String.fromCharCode(65 + i),
  );
  const correctIndex = keys.indexOf(correctAnswer);
  const options: RenderedOption[] = keys.map((key, index) => ({
    key,
    content: `第 ${index + 1} 个图形`,
    svg: "",
  }));
  options[correctIndex].svg = correctSvg;
  let distractorIndex = 0;
  for (const option of options) {
    if (!option.svg) {
      option.svg = distractorSvgs[distractorIndex] ?? distractorSvgs[0];
      distractorIndex += 1;
    }
  }
  return options;
}

function stemFigures(
  svgs: { children: string; sig: string }[],
): RenderedVariant["stemFigures"] {
  return svgs.map((figure, index) => ({
    label: STEM_LABELS[index] || `图${index + 1}`,
    svg: svgFigure(figure.children, figure.sig),
  }));
}

function countFigure(
  shape: ShapeKind,
  count: number,
): { children: string; sig: string } {
  const copies = positions(count)
    .map(([x, y]) => shapeSvg(shape, x, y, 7))
    .join("");
  return { children: copies, sig: String(count) };
}

function classifyFigure(
  groupA: ShapeKind,
  groupB: ShapeKind,
  countA: number,
  countB: number,
) {
  const kinds: ShapeKind[] = [];
  for (let i = 0; i < countA + countB; i += 1) {
    kinds.push(i < countA ? groupA : groupB);
  }
  const children = positions(kinds.length)
    .map(([x, y], i) => shapeSvg(kinds[i], x, y, 7))
    .join("");
  return { children, sig: `${countA},${countB}` };
}

function applyGridOp(
  op: GridOpRule["op"],
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

const SYMMETRY_COUNT: Record<ShapeKind, number> = {
  circle: 4,
  rect: 2,
  triangle: 3,
  diamond: 4,
  pentagon: 5,
  line: 1,
};

function symmetrySig(mode: SymmetryRule["mode"], shape: ShapeKind): string {
  if (mode === "curve-straight")
    return shape === "circle" ? "curve" : "straight";
  return String(SYMMETRY_COUNT[shape]);
}

function topologyFigure(count: number) {
  const children =
    count === 1
      ? shapeSvg("circle", 50, 50, 22)
      : positions(count)
          .map(([x, y]) => shapeSvg("circle", x + 4, y, 9))
          .join("");
  return { children, sig: String(count) };
}

// ---------- 渲染分发 ----------

export function renderVariant(
  rule: RuleSpec,
  optionCount = 4,
): RenderedVariant {
  switch (rule.kind) {
    case "count": {
      const expected = rule.start + 3 * rule.step;
      const stem = stemFigures([
        countFigure(rule.shape, rule.start),
        countFigure(rule.shape, rule.start + rule.step),
        countFigure(rule.shape, rule.start + 2 * rule.step),
      ]);
      const distractors = dedupeNumbers(
        [
          expected - rule.step,
          expected + rule.step,
          expected - 1,
          expected + 1,
        ],
        expected,
      ).map((count) =>
        svgFigure(countFigure(rule.shape, count).children, String(count)),
      );
      return {
        stemFigures: stem,
        options: assembleOptions(
          rule.correctAnswer,
          optionCount,
          svgFigure(
            countFigure(rule.shape, expected).children,
            String(expected),
          ),
          distractors,
        ),
      };
    }
    case "classify": {
      const expectedSig = `${rule.countB},${rule.countA}`;
      const stem = stemFigures([
        classifyFigure(rule.groupA, rule.groupB, rule.countA, rule.countB),
        classifyFigure(rule.groupA, rule.groupB, rule.countB, rule.countA),
        classifyFigure(rule.groupA, rule.groupB, rule.countA, rule.countB),
      ]);
      const correct = classifyFigure(
        rule.groupA,
        rule.groupB,
        rule.countB,
        rule.countA,
      );
      const distractorPairs: Array<[number, number]> = [
        [rule.countA, rule.countA],
        [rule.countB, rule.countB],
        [rule.countA + rule.countB, 0],
      ];
      const distractors = distractorPairs
        .map(([a, b]) => {
          const figure = classifyFigure(rule.groupA, rule.groupB, a, b);
          return svgFigure(figure.children, figure.sig);
        })
        .filter((svg) => parseSig(svg) !== expectedSig);
      return {
        stemFigures: stem,
        options: assembleOptions(
          rule.correctAnswer,
          optionCount,
          svgFigure(correct.children, correct.sig),
          distractors,
        ),
      };
    }
    case "rotate": {
      const step = rule.stepDeg * rule.direction;
      const expected = rule.startDeg + 3 * step;
      const stem = stemFigures([
        {
          children: arrowFigure(rule.startDeg),
          sig: String(normAngle(rule.startDeg)),
        },
        {
          children: arrowFigure(rule.startDeg + step),
          sig: String(normAngle(rule.startDeg + step)),
        },
        {
          children: arrowFigure(rule.startDeg + 2 * step),
          sig: String(normAngle(rule.startDeg + 2 * step)),
        },
      ]);
      const expectedSig = String(normAngle(expected));
      const distractors = dedupeNumbers(
        [expected + step, expected - step, expected + 180],
        normAngle(expected),
      ).map((angle) => svgFigure(arrowFigure(angle), String(normAngle(angle))));
      return {
        stemFigures: stem,
        options: assembleOptions(
          rule.correctAnswer,
          optionCount,
          svgFigure(arrowFigure(expected), expectedSig),
          distractors,
        ),
      };
    }
    case "gridOp": {
      const result = applyGridOp(rule.op, rule.gridA, rule.gridB);
      const expectedSig = gridSig(result);
      const flip = result.map((row, r) =>
        row.map((cell, c) =>
          r === 2 && c === 2 ? ((1 - cell) as 0 | 1) : cell,
        ),
      );
      const inverse = result.map((row) =>
        row.map((cell) => (1 - cell) as 0 | 1),
      );
      const sibling = applyGridOp(
        rule.op === "and" ? "or" : "and",
        rule.gridA,
        rule.gridB,
      );
      const candidates = [flip, inverse, sibling];
      const seen = new Set<string>([expectedSig]);
      const distractors: string[] = [];
      for (const grid of candidates) {
        const sig = gridSig(grid);
        if (!seen.has(sig)) {
          seen.add(sig);
          distractors.push(svgFigure(gridFigure(grid), sig));
        }
      }
      return {
        stemFigures: stemFigures([
          { children: gridFigure(rule.gridA), sig: gridSig(rule.gridA) },
          { children: gridFigure(rule.gridB), sig: gridSig(rule.gridB) },
          { children: gridFigure(result), sig: expectedSig },
        ]),
        options: assembleOptions(
          rule.correctAnswer,
          optionCount,
          svgFigure(gridFigure(result), expectedSig),
          distractors,
        ),
      };
    }
    case "move": {
      const at = (i: number): [number, number] => [
        wrap3(rule.start[0] + rule.step[0] * i),
        wrap3(rule.start[1] + rule.step[1] * i),
      ];
      const expected = at(3);
      const expectedSig = `${expected[0]},${expected[1]}`;
      const emptyGrid: (0 | 1)[][] = Array.from({ length: 3 }, () => [0, 0, 0]);
      const stem = stemFigures([
        {
          children: gridFigure(emptyGrid, at(0)),
          sig: `${at(0)[0]},${at(0)[1]}`,
        },
        {
          children: gridFigure(emptyGrid, at(1)),
          sig: `${at(1)[0]},${at(1)[1]}`,
        },
        {
          children: gridFigure(emptyGrid, at(2)),
          sig: `${at(2)[0]},${at(2)[1]}`,
        },
      ]);
      const seen = new Set<string>([expectedSig]);
      const distractors: string[] = [];
      for (const candidate of [at(2), at(1), [2, 2] as [number, number]]) {
        const sig = `${candidate[0]},${candidate[1]}`;
        if (!seen.has(sig)) {
          seen.add(sig);
          distractors.push(svgFigure(gridFigure(emptyGrid, candidate), sig));
        }
      }
      return {
        stemFigures: stem,
        options: assembleOptions(
          rule.correctAnswer,
          optionCount,
          svgFigure(gridFigure(emptyGrid, expected), expectedSig),
          distractors,
        ),
      };
    }
    case "symmetry": {
      const shapeFigure = (shape: ShapeKind) => ({
        children: shapeSvg(shape, 50, 50, 24),
        sig: symmetrySig(rule.mode, shape),
      });
      const expectedSig = symmetrySig(rule.mode, rule.next);
      const stem = stemFigures(rule.seq.map(shapeFigure));
      const seen = new Set<string>([expectedSig]);
      const distractors: string[] = [];
      for (const shape of [
        "circle",
        "rect",
        "triangle",
        "diamond",
        "pentagon",
        "line",
      ] as ShapeKind[]) {
        const figure = shapeFigure(shape);
        if (!seen.has(figure.sig)) {
          seen.add(figure.sig);
          distractors.push(svgFigure(figure.children, figure.sig));
        }
        if (distractors.length === 3) break;
      }
      const correct = shapeFigure(rule.next);
      return {
        stemFigures: stem,
        options: assembleOptions(
          rule.correctAnswer,
          optionCount,
          svgFigure(correct.children, correct.sig),
          distractors,
        ),
      };
    }
    case "topology": {
      const stem = stemFigures(
        rule.counts.map((count) => topologyFigure(count)),
      );
      const distractors = dedupeNumbers(
        [rule.nextCount + 1, rule.nextCount - 1, rule.nextCount + 2],
        rule.nextCount,
      ).map((count) => {
        const figure = topologyFigure(count);
        return svgFigure(figure.children, figure.sig);
      });
      const correct = topologyFigure(rule.nextCount);
      return {
        stemFigures: stem,
        options: assembleOptions(
          rule.correctAnswer,
          optionCount,
          svgFigure(correct.children, correct.sig),
          distractors,
        ),
      };
    }
  }
}
