// 图推引擎自洽性回归：8 类 spec 各自渲染后必须通过独立验证器；篡改必须被抓住。
import { renderVariant } from "../src/figureEngine/generators";
import {
  parseSig,
  validateRuleSpec,
  type RuleSpec,
} from "../src/figureEngine/spec";
import { verifyVariant } from "../src/figureEngine/verify";
import {
  DEMO_SPECS,
  randomSpecFor,
  renderRuleSequence,
  sequenceKindFor,
} from "../src/figureEngine/sequence";

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`断言失败: ${msg}`);
}

const validRules: RuleSpec[] = [
  { kind: "count", shape: "circle", start: 1, step: 1, correctAnswer: "A" },
  {
    kind: "classify",
    groupA: "circle",
    groupB: "triangle",
    countA: 2,
    countB: 1,
    correctAnswer: "B",
  },
  {
    kind: "rotate",
    startDeg: 0,
    stepDeg: 45,
    direction: 1,
    correctAnswer: "C",
  },
  {
    kind: "gridOp",
    op: "xor",
    gridA: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ],
    gridB: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
    correctAnswer: "D",
  },
  { kind: "move", start: [0, 0], step: [0, 1], correctAnswer: "A" },
  {
    kind: "symmetry",
    mode: "symmetry",
    seq: ["diamond", "triangle", "rect"],
    next: "line",
    correctAnswer: "B",
  },
  {
    kind: "symmetry",
    mode: "curve-straight",
    seq: ["circle", "rect", "circle"],
    next: "rect",
    correctAnswer: "C",
  },
  { kind: "topology", counts: [1, 2, 3], nextCount: 4, correctAnswer: "D" },
];

// 1. 参数校验：合法 spec 全过，畸形 spec 必须被拒
for (const rule of validRules) {
  assert(validateRuleSpec(rule) === null, `${rule.kind} 合法 spec 不应被拒`);
}
assert(
  validateRuleSpec({
    kind: "count",
    shape: "circle",
    start: 0,
    step: 1,
    correctAnswer: "A",
  }) !== null,
  "count.start=0 应被拒",
);
assert(
  validateRuleSpec({
    kind: "rotate",
    startDeg: 0,
    stepDeg: 40,
    direction: 1,
    correctAnswer: "A",
  }) !== null,
  "rotate 非 15 倍数步长应被拒",
);
assert(
  validateRuleSpec({
    kind: "gridOp",
    op: "xor",
    gridA: [
      [1, 0],
      [0, 1],
    ],
    gridB: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ],
    correctAnswer: "A",
  }) !== null,
  "gridOp 非 3×3 网格应被拒",
);
assert(
  validateRuleSpec({
    kind: "move",
    start: [0, 0],
    step: [0, 0],
    correctAnswer: "A",
  }) !== null,
  "move 零向量应被拒",
);
assert(validateRuleSpec({ kind: "nonsense" }) !== null, "未知 kind 应被拒");

// 2. 渲染 → 独立验证：8 类全部自洽
for (const rule of validRules) {
  const rendered = renderVariant(rule);
  const error = verifyVariant(rule, rendered);
  assert(error === null, `${rule.kind} 自洽失败: ${error}`);
  assert(rendered.stemFigures.length === 3, `${rule.kind} 应有 3 张题干图`);
  assert(rendered.options.length === 4, `${rule.kind} 应有 4 个选项`);
  assert(
    rendered.options.some((option) => option.key === rule.correctAnswer),
    `${rule.kind} correctAnswer 应命中选项`,
  );
}

// 3. 篡改必须被验证器抓住：改了规律参数但图形还是旧参数
{
  const rule: RuleSpec = {
    kind: "count",
    shape: "circle",
    start: 1,
    step: 1,
    correctAnswer: "A",
  };
  const rendered = renderVariant(rule);
  const tampered: RuleSpec = { ...rule, step: 2 };
  assert(
    verifyVariant(tampered, rendered) !== null,
    "篡改 step 后验证器必须报错",
  );
}

// 4. 正确选项必须落在 correctAnswer 指定位
{
  const rule: RuleSpec = {
    kind: "rotate",
    startDeg: 0,
    stepDeg: 90,
    direction: 1,
    correctAnswer: "D",
  };
  const rendered = renderVariant(rule);
  const correct = rendered.options.find((option) => option.key === "D");
  assert(
    correct && /data-sig='270'/.test(correct.svg),
    "旋转正确项应落在 D 位且角度为 270",
  );
  for (const option of rendered.options) {
    if (option.key !== "D")
      assert(
        !/data-sig='270'/.test(option.svg),
        `干扰项 ${option.key} 不应与正确项相同`,
      );
  }
}

// 5. 步进序列契约（graphic-lab-interactivity-plan 1.3）：高频 4 类序列与 verifyVariant 规律一致
{
  const seqSubCategories = ["数量规律", "分类分组", "时针旋转", "位置移动"];
  for (const sub of seqSubCategories) {
    const spec: RuleSpec | undefined = DEMO_SPECS[sub];
    assert(spec !== undefined, `${sub} 应有演示 spec`);
    const steps = renderRuleSequence(spec);
    assert(steps && steps.length >= 3, `${sub} 序列应 ≥3 步`);
    for (const step of steps!) {
      assert(step.svg.includes("<svg"), `${sub} 每步 svg 非空`);
      assert(step.caption.length > 0, `${sub} 每步 caption 非空`);
      assert(
        step.changedIds && step.changedIds.length > 0,
        `${sub} 每步 changedIds 非空`,
      );
    }
    // 末步 = 正确答案形态：sig 与 renderVariant 正确选项一致
    const rendered = renderVariant(spec!);
    const correct = rendered.options.find((o) => o.key === spec!.correctAnswer);
    assert(
      parseSig(steps![steps!.length - 1].svg) === parseSig(correct!.svg),
      `${sub} 序列末步应等于正确答案形态`,
    );
  }
  // 低频 4 类暂无序列渲染器（优雅降级）
  for (const sub of ["重叠相消", "黑白位运算", "对称曲直", "拓扑连接"]) {
    assert(sequenceKindFor(sub) === null, `${sub} 暂不应有序列渲染器`);
    assert(randomSpecFor(sub) === null, `${sub} randomSpecFor 应返回 null`);
  }
  // 随机 spec（真题示意动画）必须全部通过参数校验且可渲染
  for (const sub of seqSubCategories) {
    for (let i = 0; i < 20; i += 1) {
      const spec = randomSpecFor(sub);
      assert(spec !== null, `${sub} 随机 spec 不应为 null`);
      assert(validateRuleSpec(spec) === null, `${sub} 随机 spec 应合法`);
      const steps = renderRuleSequence(spec!);
      assert(steps && steps.length >= 3, `${sub} 随机 spec 应可渲染序列`);
    }
  }
}

console.log("figure engine check passed");
