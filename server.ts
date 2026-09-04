import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  PROMPT_TASKS,
  buildChatContextMessage,
  buildComprehensiveDiagnosePrompt,
  buildDiagnosePrompt,
  buildExplainPrompt,
  buildGraphicPatternPrompt,
  buildVariantPrompt,
  pickAnswerKey,
} from "./prompts";
import { sanitizeVariantSvgs } from "./svgSanitize";
import { parseJsonLoose } from "./jsonLoose";
import { renderVariant } from "./src/figureEngine/generators";
import { SUB_CATEGORY_KINDS, validateRuleSpec } from "./src/figureEngine/spec";
import { verifyVariant } from "./src/figureEngine/verify";

dotenv.config();

type AIProvider = "gemini" | "deepseek" | "minimax" | "openai" | "anthropic";
type ChatTurn = { role: "user" | "model"; content: string };

interface GenerateOptions {
  /** Single-turn prompt (mutually exclusive with messages) */
  prompt?: string;
  /** Multi-turn conversation history (mutually exclusive with prompt) */
  messages?: ChatTurn[];
  system?: string;
  temperature?: number;
  /** Ask the model to return strict JSON */
  json?: boolean;
  /** Max output tokens */
  maxTokens?: number;
}

/** OpenAI 兼容协议提供商（DeepSeek / 自定义 OpenAI 中转站） */
const COMPAT_PROVIDER_META: Record<
  "deepseek" | "openai",
  {
    envPrefix: string;
    defaultBase: string;
    defaultModel: string;
    label: string;
    needsBaseUrl: boolean;
  }
> = {
  deepseek: {
    envPrefix: "DEEPSEEK",
    defaultBase: "https://api.deepseek.com",
    defaultModel: "deepseek-chat",
    label: "DeepSeek",
    needsBaseUrl: false,
  },
  openai: {
    envPrefix: "OPENAI",
    defaultBase: "",
    defaultModel: "gpt-4o-mini",
    label: "自定义中转站(OpenAI)",
    needsBaseUrl: true,
  },
};

/** Anthropic 协议提供商（MiniMax coding plan / Claude / 自定义 Anthropic 中转站） */
const ANTHROPIC_PROVIDER_META: Record<
  "minimax" | "anthropic",
  {
    envPrefix: string;
    defaultBase: string;
    defaultModel: string;
    label: string;
    needsBaseUrl: boolean;
  }
> = {
  minimax: {
    envPrefix: "MINIMAX",
    defaultBase: "https://api.minimax.io/anthropic",
    defaultModel: "MiniMax-M2.7",
    label: "MiniMax Coding Plan",
    needsBaseUrl: false,
  },
  anthropic: {
    envPrefix: "ANTHROPIC",
    defaultBase: "https://api.anthropic.com",
    defaultModel: "claude-sonnet-4-20250514",
    label: "Anthropic 中转站",
    needsBaseUrl: false,
  },
};

function modelLabelFor(provider: AIProvider): { model: string; label: string } {
  if (provider === "gemini") {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const label = model
      .replace(/^gemini-/, "Gemini ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { model, label };
  }
  if (provider === "deepseek" || provider === "openai") {
    const meta = COMPAT_PROVIDER_META[provider];
    const model = process.env[`${meta.envPrefix}_MODEL`] || meta.defaultModel;
    return { model, label: meta.label + (model ? ` ${model}` : "") };
  }
  const meta = ANTHROPIC_PROVIDER_META[provider as "minimax" | "anthropic"];
  const model = process.env[`${meta.envPrefix}_MODEL`] || meta.defaultModel;
  return { model, label: meta.label + (model ? ` ${model}` : "") };
}

function detectProvider(): AIProvider {
  const explicit = process.env.AI_PROVIDER?.toLowerCase();
  if (
    explicit === "gemini" ||
    explicit === "deepseek" ||
    explicit === "minimax" ||
    explicit === "openai" ||
    explicit === "anthropic"
  ) {
    return explicit as AIProvider;
  }
  // 自动策略：按已配置的 key 优先级选择
  return process.env.MINIMAX_API_KEY
    ? "minimax"
    : process.env.DEEPSEEK_API_KEY
      ? "deepseek"
      : process.env.ANTHROPIC_API_KEY
        ? "anthropic"
        : process.env.OPENAI_API_KEY
          ? "openai"
          : "gemini";
}

function resolveAIConfig(): {
  provider: AIProvider;
  model: string;
  label: string;
} {
  const provider = detectProvider();
  return { provider, ...modelLabelFor(provider) };
}

/** 主引擎失败时的兜底引擎：默认 MiniMax（模型由 MINIMAX_MODEL 自行配置） */
function resolveFallbackConfig(): {
  provider: AIProvider;
  model: string;
  label: string;
} | null {
  const explicit = process.env.AI_FALLBACK_PROVIDER?.toLowerCase();
  let provider: AIProvider | null = null;
  if (
    explicit === "gemini" ||
    explicit === "deepseek" ||
    explicit === "minimax" ||
    explicit === "openai" ||
    explicit === "anthropic"
  ) {
    provider = explicit as AIProvider;
  } else if (process.env.MINIMAX_API_KEY) {
    provider = "minimax";
  }
  if (!provider || provider === AI_CONFIG.provider) return null;
  return { provider, ...modelLabelFor(provider) };
}

const AI_CONFIG = resolveAIConfig();

// ---------- Gemini backend ----------

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

async function generateWithGemini(
  opts: GenerateOptions,
  model: string,
): Promise<GenerationResult> {
  const ai = getGeminiClient();
  const contents: any = opts.messages
    ? opts.messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }))
    : opts.prompt!;

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      temperature: opts.temperature,
      ...(opts.maxTokens ? { maxOutputTokens: opts.maxTokens } : {}),
      ...(opts.system ? { systemInstruction: opts.system } : {}),
      ...(opts.json ? { responseMimeType: "application/json" } : {}),
    },
  });
  // finishReason=MAX_TOKENS 表示输出被 maxTokens 截断而非语法问题（审计 V-1）
  const truncated =
    String(response.candidates?.[0]?.finishReason ?? "").toUpperCase() ===
    "MAX_TOKENS";
  return { text: response.text ?? "", truncated };
}

// ---------- OpenAI 兼容后端（DeepSeek / MiniMax / 自定义中转站） ----------

function compatConfig(provider: "deepseek" | "openai"): {
  baseUrl: string;
  apiKey: string;
  model: string;
} {
  const meta = COMPAT_PROVIDER_META[provider];
  const apiKey = process.env[`${meta.envPrefix}_API_KEY`];
  if (!apiKey) {
    throw new Error(
      `未配置 ${meta.envPrefix}_API_KEY，无法使用 ${meta.label} 引擎`,
    );
  }
  const baseUrl = (
    process.env[`${meta.envPrefix}_BASE_URL`] ||
    meta.defaultBase ||
    ""
  ).replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error(`未配置 ${meta.envPrefix}_BASE_URL，中转站地址不能为空`);
  }
  return {
    baseUrl,
    apiKey,
    model: process.env[`${meta.envPrefix}_MODEL`] || meta.defaultModel,
  };
}

async function generateWithOpenAICompatible(
  provider: "deepseek" | "openai",
  opts: GenerateOptions,
  model: string,
): Promise<GenerationResult> {
  const { baseUrl, apiKey } = compatConfig(provider);

  const messages = [
    ...(opts.system ? [{ role: "system", content: opts.system }] : []),
    ...(opts.messages
      ? opts.messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }))
      : [{ role: "user", content: opts.prompt! }]),
  ];

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: opts.temperature,
  };
  if (opts.json) {
    body.response_format = { type: "json_object" };
  }
  if (opts.maxTokens) body.max_tokens = opts.maxTokens;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `${COMPAT_PROVIDER_META[provider].label} API ${res.status}: ${detail.slice(0, 300)}`,
    );
  }

  const data: any = await res.json();
  const choice = data.choices?.[0];
  const content: string | undefined = choice?.message?.content;
  if (!content) {
    throw new Error(`${COMPAT_PROVIDER_META[provider].label} 返回内容为空`);
  }
  // finish_reason=length 表示被 max_tokens 截断（审计 V-1）
  return { text: content, truncated: choice?.finish_reason === "length" };
}

// ---------- Anthropic 兼容后端（MiniMax coding plan / Claude / 自定义中转站） ----------

function anthropicConfig(provider: "minimax" | "anthropic"): {
  baseUrl: string;
  apiKey: string;
  model: string;
} {
  const meta = ANTHROPIC_PROVIDER_META[provider];
  const apiKey = process.env[`${meta.envPrefix}_API_KEY`];
  if (!apiKey) {
    throw new Error(
      `未配置 ${meta.envPrefix}_API_KEY，无法使用 ${meta.label} 引擎`,
    );
  }
  const baseUrl = (
    process.env[`${meta.envPrefix}_BASE_URL`] ||
    meta.defaultBase ||
    ""
  ).replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error(`未配置 ${meta.envPrefix}_BASE_URL，中转站地址不能为空`);
  }
  return {
    baseUrl,
    apiKey,
    model: process.env[`${meta.envPrefix}_MODEL`] || meta.defaultModel,
  };
}

async function generateWithAnthropic(
  provider: "minimax" | "anthropic",
  opts: GenerateOptions,
  model: string,
): Promise<GenerationResult> {
  const { baseUrl, apiKey } = anthropicConfig(provider);

  const messages = opts.messages
    ? opts.messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }))
    : [{ role: "user", content: opts.prompt! }];

  const body: Record<string, unknown> = {
    model,
    max_tokens: opts.maxTokens || 4096,
    messages,
  };
  if (opts.system) {
    // Anthropic 协议无原生 JSON mode（Gemini/OpenAI 兼容路径均有），
    // JSON 约束只能靠 system 文本补强（审计 4.6）
    body.system = opts.json
      ? `${opts.system}\n\n输出格式硬性要求：只输出一个语法合法的 JSON 对象（以 { 开始、以 } 结束），不含任何解释文字或 markdown 代码块标记。`
      : opts.system;
  }
  if (typeof opts.temperature === "number") body.temperature = opts.temperature;

  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `${ANTHROPIC_PROVIDER_META[provider].label} API ${res.status}: ${detail.slice(0, 300)}`,
    );
  }

  const data: any = await res.json();
  const text: string | undefined = Array.isArray(data.content)
    ? data.content
        .filter((b: any) => b?.type === "text")
        .map((b: any) => b.text || "")
        .join("")
    : undefined;
  if (!text) {
    throw new Error(`${ANTHROPIC_PROVIDER_META[provider].label} 返回内容为空`);
  }
  // stop_reason=max_tokens 表示被 max_tokens 截断（审计 V-1）
  return { text, truncated: data.stop_reason === "max_tokens" };
}

// ---------- Unified dispatcher ----------

/** 生成结果：truncated 区分「截断」与「语法错误」两种失败（审计 V-1） */
interface GenerationResult {
  text: string;
  truncated: boolean;
}

async function generateWithProvider(
  cfg: { provider: AIProvider; model: string },
  opts: GenerateOptions,
): Promise<GenerationResult> {
  switch (cfg.provider) {
    case "gemini":
      return generateWithGemini(opts, cfg.model);
    case "deepseek":
    case "openai":
      return generateWithOpenAICompatible(cfg.provider, opts, cfg.model);
    case "minimax":
    case "anthropic":
      return generateWithAnthropic(cfg.provider, opts, cfg.model);
    default:
      throw new Error(`未知 AI 引擎: ${cfg.provider}`);
  }
}

async function generateDetailed(
  opts: GenerateOptions,
): Promise<GenerationResult> {
  if (!opts.prompt && !opts.messages?.length) {
    throw new Error("generateText 需要 prompt 或 messages");
  }

  try {
    return await generateWithProvider(AI_CONFIG, opts);
  } catch (primaryError: any) {
    const fallback = resolveFallbackConfig();
    if (!fallback || fallback.provider === AI_CONFIG.provider) {
      throw primaryError;
    }
    console.warn(
      `[AI Fallback] 主引擎 ${AI_CONFIG.label} 调用失败（${primaryError?.message || primaryError}），切换到兜底引擎 ${fallback.label}`,
    );
    return generateWithProvider(fallback, opts);
  }
}

async function generateText(opts: GenerateOptions): Promise<string> {
  return (await generateDetailed(opts)).text;
}

/** 生成严格 JSON：首次解析失败时重试。修复请求携带完整上下文（原任务 + 完整上次输出），
 *  避免模型只看到残缺片段而凭空重造后半段（对应审计 P1-6）。
 *  截断与语法错误分开处理：截断时沿用同上限重试大概率再截断，
 *  先附带精简指令重试一次，仍截断则报错终止，不再盲入修复回路（审计 V-1）。 */
async function generateJsonSafely(
  prompt: string,
  opts: { system?: string; temperature?: number; maxTokens?: number },
): Promise<any> {
  let first = await generateDetailed({ prompt, json: true, ...opts });
  if (first.truncated) {
    console.warn(
      "[AI JSON] 输出达到 maxTokens 上限被截断，附加精简指令重试一次",
    );
    first = await generateDetailed({
      prompt:
        prompt +
        "\n\n【输出长度硬约束】上一次输出因超过长度上限被截断。请在保持 JSON 结构与全部字段完整的前提下大幅精简内容：缩短题干、选项与解析文字，简化每个 SVG（保留可辨认的局部特征即可），确保完整输出。",
      json: true,
      ...opts,
    });
    if (first.truncated) {
      throw new Error("生成内容超过长度上限被截断，请重试或稍后再试");
    }
  }
  try {
    return parseJsonLoose(first.text);
  } catch (e: any) {
    console.warn(
      `[AI JSON] 首次解析失败: ${e.message}\n原始输出(前1500字):\n${first.text.slice(0, 1500)}`,
    );
    const repairInstruction = `你上一次输出的 JSON 无法解析，错误信息：${e.message}

请重新输出【完整的、严格的 JSON】：原样保留正确内容，只修复语法错误（未转义引号、未闭合括号等）。要求：
- 不要任何多余文字、注释或 markdown 代码块标记。
- 所有字符串用双引号包裹；字符串内部若出现双引号必须转义为 "。
- SVG 字符串内部属性一律用单引号，例如 "svg": "<svg viewBox='0 0 100 100'><rect x='10' width='80' height='80'/></svg>"。
- 确保 JSON 完整闭合，并适当精简过长字段避免再次截断。`;
    const second = await generateDetailed({
      messages: [
        { role: "user", content: prompt },
        { role: "model", content: first.text },
        { role: "user", content: repairInstruction },
      ],
      json: true,
      ...opts,
    });
    if (second.truncated) {
      throw new Error("修复重试的输出仍超过长度上限被截断，请重试");
    }
    return parseJsonLoose(second.text);
  }
}

/** 兑底链路复杂度校验：绘制指令数阈值，防止「简单单一形状」退回（阶段五 5.4） */
const DRAW_COMMAND_TAGS =
  /<(rect|circle|ellipse|line|polyline|polygon|path)\b/g;

function drawCommands(svg: string): number {
  return (svg.match(DRAW_COMMAND_TAGS) || []).length;
}

function legacyGraphicComplexityOk(parsed: any): boolean {
  const figs: any[] = parsed?.stemFigures || [];
  const opts: any[] = parsed?.options || [];
  if (figs.length < 2) return false;
  return (
    figs.every((f) => drawCommands(String(f?.svg || "")) >= 2) &&
    opts.every((o) => drawCommands(String(o?.svg || "")) >= 1) &&
    figs.reduce((sum, f) => sum + drawCommands(String(f?.svg || "")), 0) >= 10
  );
}

/** 组装全部中间件与路由；Vercel 上由 api/index.ts 导出为 Serverless Function。 */
export function buildApp() {
  const app = express();

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Active AI engine info (Gemini / DeepSeek)
  app.get("/api/ai/status", (_req, res) => {
    res.json(AI_CONFIG);
  });

  // AI Detailed Question Explanation & Mindmap
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const { question, selectedOption } = req.body;
      // userNote 是用户自由输入，进 prompt 前做长度封顶（内容按数据段处理，防注入声明在提示词侧）
      const userNote =
        typeof req.body.userNote === "string"
          ? req.body.userNote.slice(0, 2000)
          : undefined;
      if (!question) {
        return res.status(400).json({ error: "缺少题目信息" });
      }

      const prompt = buildExplainPrompt(question, selectedOption, userNote);
      const explanation = await generateText({
        prompt,
        system: PROMPT_TASKS.explain.system,
        temperature: PROMPT_TASKS.explain.temperature,
        maxTokens: PROMPT_TASKS.explain.maxTokens,
      });

      res.json({ explanation });
    } catch (error: any) {
      console.error("AI Explain Error:", error);
      res.status(500).json({
        error: "AI 辅导生成失败，请检查网络或稍后重试",
        details: error.message,
      });
    }
  });

  // AI Graphic Reasoning Specialized Visual Pattern Analysis
  app.post("/api/ai/graphic-pattern", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ error: "缺少图推题目信息" });
      }

      const prompt = buildGraphicPatternPrompt(question);
      const analysis = await generateText({
        prompt,
        system: PROMPT_TASKS.graphicPattern.system,
        temperature: PROMPT_TASKS.graphicPattern.temperature,
        maxTokens: PROMPT_TASKS.graphicPattern.maxTokens,
      });

      res.json({ analysis });
    } catch (error: any) {
      console.error("Graphic Pattern AI Error:", error);
      res.status(500).json({
        error: "图形规律分析失败",
        details: error.message,
      });
    }
  });

  // AI Similar Question Generator (举一反三智能变式)
  app.post("/api/ai/generate-variant", async (req, res) => {
    try {
      const { originalQuestion } = req.body;
      if (!originalQuestion) {
        return res.status(400).json({ error: "缺少母题信息" });
      }

      const isData = originalQuestion.category === "data";
      const isGraphic = originalQuestion.category === "graphic";
      const subCategory = originalQuestion.subCategory || "";
      const optionCount = originalQuestion.options?.length || 4;
      // covered 考点走 spec → renderer：图形由代码确定性渲染并机械验证；
      // 未覆盖考点走旧「模型直出 SVG」+ 复杂度兜底
      const specPath =
        isGraphic && !!SUB_CATEGORY_KINDS[subCategory] && optionCount === 4;

      const answerKey = pickAnswerKey(originalQuestion);
      const prompt = buildVariantPrompt(originalQuestion, { answerKey });
      let parsed = await generateJsonSafely(prompt, {
        system: PROMPT_TASKS.variant.system,
        temperature: PROMPT_TASKS.variant.temperature,
        maxTokens: PROMPT_TASKS.variant.maxTokens,
      });

      if (specPath) {
        const specError = validateRuleSpec(parsed?.ruleSpec);
        if (specError) {
          throw new Error(`AI 生成的 ruleSpec 非法：${specError}`);
        }
        if (parsed.ruleSpec.correctAnswer !== answerKey) {
          throw new Error(
            `AI 生成的 ruleSpec.correctAnswer 应为 ${answerKey}，实际 ${parsed.ruleSpec.correctAnswer}`,
          );
        }
        const rendered = renderVariant(parsed.ruleSpec, optionCount);
        const verifyError = verifyVariant(parsed.ruleSpec, rendered);
        if (verifyError) {
          throw new Error(`图推变式自洽校验失败：${verifyError}`);
        }
        parsed.stemFigures = rendered.stemFigures;
        parsed.options = rendered.options;
        parsed.correctAnswer = parsed.ruleSpec.correctAnswer;
      } else if (isGraphic) {
        // 兜底链路：复杂度不达标带反馈重试一次（阶段五 5.4）
        if (!legacyGraphicComplexityOk(parsed)) {
          parsed = await generateJsonSafely(
            `${prompt}\n\n【上一次生成被退回】图形过于简单：每张题干图至少 2 个绘制元素、每个选项至少 1 个、题干合计至少 10 个绘制元素。请显著增加图形复杂度后重新输出完整 JSON。`,
            {
              system: PROMPT_TASKS.variant.system,
              temperature: PROMPT_TASKS.variant.temperature,
              maxTokens: PROMPT_TASKS.variant.maxTokens,
            },
          );
          if (!legacyGraphicComplexityOk(parsed)) {
            throw new Error("AI 生成的图形复杂度不达标，请重试");
          }
        }
      }

      // SVG 兜底清洗：前端 dangerouslySetInnerHTML 直注，提示词约束不能作为唯一防线
      sanitizeVariantSvgs(parsed);

      // 选项契约：数量与母题一致（题库存在 5 选项题）、key 不重复、correctAnswer 必须命中
      const variantOptions = parsed.options;
      if (!Array.isArray(variantOptions) || variantOptions.length === 0) {
        throw new Error("AI 生成的变式题缺少选项，请重试");
      }
      const expectedCount = originalQuestion.options?.length;
      if (expectedCount && variantOptions.length !== expectedCount) {
        throw new Error(
          `AI 生成的选项数量应为 ${expectedCount} 个，实际 ${variantOptions.length} 个，请重试`,
        );
      }
      const optionKeys = variantOptions.map((o: any) => o?.key);
      if (new Set(optionKeys).size !== optionKeys.length) {
        throw new Error("AI 生成的选项 key 重复，请重试");
      }
      if (!optionKeys.includes(parsed.correctAnswer)) {
        throw new Error("AI 生成的 correctAnswer 不在选项 key 中，请重试");
      }

      if (isData && parsed.chart) {
        // 轻量校验：确保图表数据结构完整且可对齐渲染，前端可直接消费
        const c = parsed.chart;
        if (!c.type || !c.title)
          throw new Error("AI 生成的图表缺少 type/title");
        if (c.type === "table") {
          if (!Array.isArray(c.columns) || !Array.isArray(c.rows))
            throw new Error("AI 生成的表格数据不完整");
        } else {
          if (
            !Array.isArray(c.categories) ||
            !Array.isArray(c.series) ||
            !c.series[0]?.data
          ) {
            throw new Error("AI 生成的图表数据不完整");
          }
          // series 与 categories 长度必须一致：前端按位置对齐渲染，缺数据点会画出值为 0 的错图
          for (const s of c.series) {
            if (
              !Array.isArray(s?.data) ||
              s.data.length !== c.categories.length
            ) {
              throw new Error(
                `AI 生成的图表 series「${s?.name || "?"}」数据点数（${s?.data?.length}）与分类数（${c.categories.length}）不一致，请重试`,
              );
            }
          }
        }
      }
      if (isGraphic) {
        const figs = parsed.stemFigures;
        if (
          !Array.isArray(figs) ||
          figs.length < 2 ||
          figs.some((f: any) => !f?.svg)
        ) {
          throw new Error("AI 生成的图推变式缺少题干图形序列(SVG)，请重试");
        }
        if (variantOptions.some((o: any) => !o?.svg)) {
          throw new Error("AI 生成的图推变式缺少选项图形(SVG)，请重试");
        }
      }
      res.json({ variant: parsed });
    } catch (error: any) {
      console.error("Generate Variant Error:", error);
      res.status(500).json({
        error: "生成变式题失败",
        details: error.message,
      });
    }
  });

  // AI 学情诊断：mistakes 模式（错题归因，错题本入口）/ analytics 模式（学情看板全维度全面诊断）
  app.post("/api/ai/diagnose", async (req, res) => {
    try {
      const { mistakeSummary, stats, analytics, mode } = req.body;

      const prompt =
        mode === "analytics"
          ? buildComprehensiveDiagnosePrompt(mistakeSummary, stats, analytics)
          : buildDiagnosePrompt(mistakeSummary, stats);
      const diagnosis = await generateText({
        prompt,
        system: PROMPT_TASKS.diagnose.system,
        temperature: PROMPT_TASKS.diagnose.temperature,
        maxTokens: PROMPT_TASKS.diagnose.maxTokens,
      });

      res.json({ diagnosis });
    } catch (error: any) {
      console.error("AI Diagnose Error:", error);
      res.status(500).json({
        error: "诊断报告生成失败",
        details: error.message,
      });
    }
  });

  // Interactive AI Study Companion (实时智能答疑互动)
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, currentQuestionContext } = req.body;
      // 题目上下文作为首条 user 消息注入，而非拼进 system：规则独占 system，
      // 不可信题面数据（OCR 噪声）不得借 system 指令权重（审计 C-1）
      const contextMessage = buildChatContextMessage(currentQuestionContext);

      // 只保留最近若干轮：题目上下文已在首条消息中，历史线性膨胀只会推高成本与延迟
      const MAX_CHAT_TURNS = 16;
      const turns: ChatTurn[] = ((messages || []) as any[])
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          content: String(m.content ?? ""),
        }))
        .filter((m) => m.content)
        .slice(-MAX_CHAT_TURNS);

      const reply = await generateText({
        messages: contextMessage
          ? [{ role: "user" as const, content: contextMessage }, ...turns]
          : turns,
        system: PROMPT_TASKS.chat.system,
        temperature: PROMPT_TASKS.chat.temperature,
        maxTokens: PROMPT_TASKS.chat.maxTokens,
      });

      res.json({ reply });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({
        error: "AI 答疑连接失败",
        details: error.message,
      });
    }
  });

  return app;
}

async function startServer() {
  const app = buildApp();
  // 默认使用 5173（Vite 约定端口），避免与占用 3000 的其他服务冲突。
  // 可通过环境变量 PORT 覆盖。
  const PORT = Number(process.env.PORT) || 5173;

  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // 动态导入：避免 vite 被打进 Vercel 函数的生产 bundle
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    const fallback = resolveFallbackConfig();
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(
      `AI engine: ${AI_CONFIG.label} (${AI_CONFIG.provider}/${AI_CONFIG.model})`,
    );
    if (fallback) {
      console.log(
        `AI fallback: ${fallback.label} (${fallback.provider}/${fallback.model})`,
      );
    }
  });
}

// Vercel 上由 api/index.ts 导出 buildApp 作为 Serverless Function，不监听端口
if (!process.env.VERCEL) startServer();
