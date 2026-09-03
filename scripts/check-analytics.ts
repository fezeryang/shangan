// 学情看板派生逻辑最小断言（analytics-dashboard-plan 阶段 0/1/3 验收）
import { allQuestions } from "../src/data/allQuestions";
import {
  buildQuestionIndex,
  subCategoryStats,
  latestRecords,
  recentTrend,
  studyRhythm,
} from "../src/data/analytics";
import {
  RAW_KNOWLEDGE_POINTS,
  computePointStats,
} from "../src/data/knowledgeTaxonomy";
import type { AnswerAttempt } from "../src/types";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) {
    console.error("✗", msg);
    process.exit(1);
  }
}

// 1. 三板块分考点结构：行覆盖全板块题量
const idx = buildQuestionIndex();
for (const cat of ["verbal", "data", "graphic"] as const) {
  const rows = subCategoryStats(cat, [], idx);
  assert(rows.length > 0, `${cat} 应有分考点行`);
  const bankSum = rows.reduce((s, r) => s + r.bankTotal, 0);
  const bankTotal = allQuestions.filter((q) => q.category === cat).length;
  assert(bankSum === bankTotal, `${cat} 分考点题数之和应等于板块题量`);
}

// 2. 口径统一：重做取最新一次；未计时(0s)作答不进均时
const graphicBank = allQuestions.filter((q) => q.category === "graphic");
const pairSub = Array.from(new Set(graphicBank.map((q) => q.subCategory)))
  .map((sub) => graphicBank.filter((q) => q.subCategory === sub))
  .find((bank) => bank.length >= 2)!;
const [a, b] = pairSub;
const attempts: AnswerAttempt[] = [
  // 首答答错（旧）→ 重做答对（新，模考未逐题计时 0s）
  {
    questionId: a.id,
    userAnswer: "A",
    isCorrect: false,
    timeSpentSec: 40,
    answeredAt: "2026-09-01T10:00:00.000Z",
  },
  {
    questionId: a.id,
    userAnswer: a.correctAnswer,
    isCorrect: true,
    timeSpentSec: 0,
    answeredAt: "2026-09-05T10:00:00.000Z",
  },
  {
    questionId: b.id,
    userAnswer: b.correctAnswer,
    isCorrect: true,
    timeSpentSec: 30,
    answeredAt: "2026-09-08T11:00:00.000Z",
  },
];
const records = latestRecords(attempts);
assert(records.length === 2, "重做同题应只保留最新一次");
assert(
  records.find((r) => r.questionId === a.id)?.isCorrect === true,
  "最新一次应为答对",
);
const row = subCategoryStats("graphic", records, idx).find(
  (r) => r.sub === a.subCategory,
)!;
assert(row.total === 2 && row.correct === 2, "分考点应计 2 题 2 对");
assert(row.avgSec === 30, "未计时(0s)作答不应计入均时");

// 3. 近 7 天趋势窗口切分
const now = Date.parse("2026-09-10T12:00:00.000Z");
const t = recentTrend(attempts, 7, now);
assert(t.recent !== null && t.before !== null, "两窗口应有数据");
assert(t.recent.count === 2 && t.before.count === 1, "趋势窗口切分按时间戳");
assert(recentTrend([], 7, now).recent === null, "空数据无趋势");

// 3.1 学习节律：按小时/星期聚合 + 无效时间戳剔除（本地时间，与热力图同口径）
const rhythm = studyRhythm([
  {
    questionId: "rhythm-1",
    userAnswer: "A",
    isCorrect: true,
    timeSpentSec: 10,
    answeredAt: "2026-09-01T09:30:00",
  },
  {
    questionId: "rhythm-2",
    userAnswer: "B",
    isCorrect: false,
    timeSpentSec: 20,
    answeredAt: "2026-09-01T09:40:00",
  },
  {
    questionId: "rhythm-3",
    userAnswer: "C",
    isCorrect: true,
    timeSpentSec: 15,
    answeredAt: "bad-timestamp",
  },
]);
assert(
  rhythm.hours.length === 1 && rhythm.hours[0].hour === 9,
  "节律应按小时聚合",
);
assert(
  rhythm.hours[0].total === 2 && rhythm.hours[0].acc === 50,
  "节律正确率按对错聚合",
);
assert(
  rhythm.weekdays.length === 1 && rhythm.weekdays[0].total === 2,
  "节律按星期聚合且无效时间戳不计入",
);

// 4. 图谱跳转：每个有题考点都落到非空专项练习列表，首选目标题量最大
let deadNodes = 0;
for (const point of RAW_KNOWLEDGE_POINTS) {
  const ps = computePointStats(point, allQuestions, []);
  if (ps.totalQuestions === 0) {
    assert(
      ps.subCategories.length === 0,
      `死节点 ${point.shortName} 不应有跳转目标`,
    );
    deadNodes += 1;
    continue;
  }
  assert(
    ps.subCategories.length > 0,
    `${point.shortName} 应有跳转 subCategory`,
  );
  const counts = ps.subCategories.map(
    (s) =>
      allQuestions.filter(
        (q) => q.category === point.category && q.subCategory === s,
      ).length,
  );
  assert(
    counts[0] === Math.max(...counts),
    `${point.shortName} 首选跳转目标应为题量最多的 subCategory`,
  );
}
console.log(
  `✓ check-analytics 全部通过（死节点 ${deadNodes} 个无跳转，其余均有非空专项练习目标）`,
);
