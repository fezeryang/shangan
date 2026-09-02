import { rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { allQuestions } from "../src/data/allQuestions";
import {
  explanationCleanups,
  type ExplanationCleanup,
} from "../src/data/explanationCleanups";

dotenv.config();

const args = new Set(process.argv.slice(2));
const valueArg = (name: string) =>
  process.argv
    .slice(2)
    .find((arg) => arg.startsWith(`${name}=`))
    ?.slice(name.length + 1);
const limit = Number(valueArg("--limit") || 0);
const delayMs = Number(valueArg("--delay-ms") || 300);
const questionId = valueArg("--id");
const force = args.has("--force");
const dryRun = args.has("--dry-run");

if (
  !Number.isFinite(limit) ||
  limit < 0 ||
  !Number.isFinite(delayMs) ||
  delayMs < 0
) {
  throw new Error("--limit 与 --delay-ms 必须是非负数字");
}
if (!limit && !questionId && !dryRun && !args.has("--confirm-full")) {
  throw new Error(
    "全量任务会产生 727 次左右的付费调用；确认后请追加 --confirm-full，或先用 --limit=3 验证",
  );
}

const apiKey = process.env.MINIMAX_API_KEY;
const baseUrl = (
  process.env.MINIMAX_BASE_URL || "https://api.minimax.io/anthropic"
).replace(/\/+$/, "");
const model = process.env.MINIMAX_MODEL || "MiniMax-M2.7";
const outputPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/explanationCleanups.ts",
);
const cleanups: Record<string, ExplanationCleanup> = { ...explanationCleanups };

function renderAsset(): string {
  return `// 由 scripts/clean-explanations.ts 离线生成；不得回写 PDF 对齐题库。\nexport interface ExplanationCleanup {\n  cleanedExplanation: string;\n  confidence: 'high' | 'medium' | 'low';\n}\n\nexport const explanationCleanups: Readonly<Record<string, ExplanationCleanup>> = ${JSON.stringify(cleanups, null, 2)};\n`;
}

async function persist(): Promise<void> {
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, renderAsset(), "utf8");
  await rename(temporaryPath, outputPath);
}

function parseCleanup(text: string, original: string): ExplanationCleanup {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("模型未返回 JSON 对象");
  let parsed: Partial<ExplanationCleanup>;
  try {
    parsed = JSON.parse(
      text.slice(start, end + 1),
    ) as Partial<ExplanationCleanup>;
  } catch {
    throw new Error("模型返回的 JSON 无法解析");
  }
  const cleanedExplanation = parsed.cleanedExplanation?.trim();
  if (!cleanedExplanation) throw new Error("cleanedExplanation 为空");
  if (cleanedExplanation.length > Math.max(500, original.length * 2 + 100)) {
    throw new Error("清洗稿异常扩写，已拒绝写入");
  }
  const originalAnswer = [
    ...original.matchAll(/(?:答案(?:为|是|选)?|选择|所以选)\s*([A-E])/gi),
  ].at(-1)?.[1];
  const cleanedAnswer = [
    ...cleanedExplanation.matchAll(
      /(?:答案(?:为|是|选)?|选择|所以选)\s*([A-E])/gi,
    ),
  ].at(-1)?.[1];
  if (
    originalAnswer &&
    cleanedAnswer?.toUpperCase() !== originalAnswer.toUpperCase()
  ) {
    throw new Error(`清洗稿未完整保留原答案结论 ${originalAnswer}`);
  }
  if (!["high", "medium", "low"].includes(parsed.confidence || "")) {
    throw new Error("confidence 必须为 high / medium / low");
  }
  return {
    cleanedExplanation,
    confidence: parsed.confidence as ExplanationCleanup["confidence"],
  };
}

async function cleanExplanation(
  question: (typeof allQuestions)[number],
): Promise<ExplanationCleanup> {
  if (!apiKey) throw new Error("未配置 MINIMAX_API_KEY");
  const prompt = `你是 OCR 文本校对员。只整理下面【原始解析】的断行、空格、标点和明显病句，使其连贯可读；绝对不得新增原文没有的数字、图形特征、推理步骤、选项结论或答案，也不得删减、概括或重排原有句子与选项释义。原文残缺时保持残缺，并将 confidence 设为 low，不得补全；原文已有“答案选 X”等结论时必须原样保留。\n\n只输出 JSON：{"cleanedExplanation":"清洗稿","confidence":"high|medium|low"}\n\n【题目 ID】${question.id}\n【题型】${question.categoryName} / ${question.subCategory}\n【题干（仅用于理解上下文，不得从中补造解析）】${question.stem}\n【原始解析】${question.explanation || "（空）"}`;
  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      temperature: 0.1,
      system:
        "只做保守 OCR 校对，不补充事实；严格输出一个 JSON 对象，不要 Markdown 代码块。",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) {
    throw new Error(
      `MiniMax API ${response.status}: ${(await response.text()).slice(0, 300)}`,
    );
  }
  const data = (await response.json()) as {
    content?: { type?: string; text?: string }[];
  };
  const text =
    data.content
      ?.filter((part) => part.type === "text")
      .map((part) => part.text || "")
      .join("") || "";
  return parseCleanup(text, question.explanation || "");
}

const pending = allQuestions.filter(
  (question) =>
    question.explanation &&
    (!questionId || question.id === questionId) &&
    (force || !!questionId || !cleanups[question.id]),
);
if (questionId && !pending.length) throw new Error(`未找到题目 ${questionId}`);
const selected = limit ? pending.slice(0, limit) : pending;
console.log(
  `待清洗 ${pending.length} 题，本次 ${selected.length} 题，已有 ${Object.keys(cleanups).length} 题`,
);

if (!dryRun) {
  let failed = 0;
  for (const [index, question] of selected.entries()) {
    try {
      cleanups[question.id] = await cleanExplanation(question);
      await persist();
      console.log(
        `[${index + 1}/${selected.length}] ${question.id} ${cleanups[question.id].confidence}`,
      );
    } catch (error) {
      failed += 1;
      console.warn(
        `[${index + 1}/${selected.length}] SKIP ${question.id}: ${error instanceof Error ? error.message : error}`,
      );
    }
    if (delayMs && index < selected.length - 1)
      await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  console.log(
    `完成：成功 ${selected.length - failed}，跳过 ${failed}（重跑会自动重试未写入的题）`,
  );
}
