import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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
  { envPrefix: string; defaultBase: string; defaultModel: string; label: string; needsBaseUrl: boolean }
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
  { envPrefix: string; defaultBase: string; defaultModel: string; label: string; needsBaseUrl: boolean }
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

function resolveAIConfig(): { provider: AIProvider; model: string; label: string } {
  const explicit = process.env.AI_PROVIDER?.toLowerCase();

  let provider: AIProvider;
  if (
    explicit === "gemini" ||
    explicit === "deepseek" ||
    explicit === "minimax" ||
    explicit === "openai" ||
    explicit === "anthropic"
  ) {
    provider = explicit as AIProvider;
  } else {
    // 自动策略：按已配置的 key 优先级选择
    provider =
      process.env.MINIMAX_API_KEY
        ? "minimax"
        : process.env.DEEPSEEK_API_KEY
          ? "deepseek"
          : process.env.ANTHROPIC_API_KEY
            ? "anthropic"
            : process.env.OPENAI_API_KEY
              ? "openai"
              : "gemini";
  }

  let model: string;
  let label: string;
  if (provider === "gemini") {
    model = process.env.GEMINI_MODEL || "gemini-3.7-flash";
    label = model
      .replace(/^gemini-/, "Gemini ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } else if (provider === "deepseek" || provider === "openai") {
    const meta = COMPAT_PROVIDER_META[provider];
    model = process.env[`${meta.envPrefix}_MODEL`] || meta.defaultModel;
    label = meta.label + (model ? ` ${model}` : "");
  } else {
    const meta = ANTHROPIC_PROVIDER_META[provider as "minimax" | "anthropic"];
    model = process.env[`${meta.envPrefix}_MODEL`] || meta.defaultModel;
    label = meta.label + (model ? ` ${model}` : "");
  }
  return { provider, model, label };
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

async function generateWithGemini(opts: GenerateOptions, model: string): Promise<string> {
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
      ...(opts.system ? { systemInstruction: opts.system } : {}),
      ...(opts.json ? { responseMimeType: "application/json" } : {}),
    },
  });
  return response.text ?? "";
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
    throw new Error(`未配置 ${meta.envPrefix}_API_KEY，无法使用 ${meta.label} 引擎`);
  }
  const baseUrl = (process.env[`${meta.envPrefix}_BASE_URL`] || meta.defaultBase || "").replace(/\/+$/, "");
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
  model: string
): Promise<string> {
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
    throw new Error(`${COMPAT_PROVIDER_META[provider].label} API ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data: any = await res.json();
  const content: string | undefined = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`${COMPAT_PROVIDER_META[provider].label} 返回内容为空`);
  }
  return content;
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
    throw new Error(`未配置 ${meta.envPrefix}_API_KEY，无法使用 ${meta.label} 引擎`);
  }
  const baseUrl = (process.env[`${meta.envPrefix}_BASE_URL`] || meta.defaultBase || "").replace(/\/+$/, "");
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
  model: string
): Promise<string> {
  const { baseUrl, apiKey } = anthropicConfig(provider);

  const messages = (opts.messages
    ? opts.messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }))
    : [{ role: "user", content: opts.prompt! }]);

  const body: Record<string, unknown> = {
    model,
    max_tokens: opts.maxTokens || 4096,
    messages,
  };
  if (opts.system) body.system = opts.system;
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
    throw new Error(`${ANTHROPIC_PROVIDER_META[provider].label} API ${res.status}: ${detail.slice(0, 300)}`);
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
  return text;
}

// ---------- Unified dispatcher ----------

async function generateText(opts: GenerateOptions): Promise<string> {
  if (!opts.prompt && !opts.messages?.length) {
    throw new Error("generateText 需要 prompt 或 messages");
  }
  switch (AI_CONFIG.provider) {
    case "gemini":
      return generateWithGemini(opts, AI_CONFIG.model);
    case "deepseek":
    case "openai":
      return generateWithOpenAICompatible(AI_CONFIG.provider, opts, AI_CONFIG.model);
    case "minimax":
    case "anthropic":
      return generateWithAnthropic(AI_CONFIG.provider, opts, AI_CONFIG.model);
    default:
      throw new Error(`未知 AI 引擎: ${AI_CONFIG.provider}`);
  }
}

/** Tolerant JSON parsing: strips markdown code fences if present. */
function parseJsonLoose(text: string): any {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned);
}

async function startServer() {
  const app = express();
  // 默认使用 5173（Vite 约定端口），避免与占用 3000 的其他服务冲突。
  // 可通过环境变量 PORT 覆盖。
  const PORT = Number(process.env.PORT) || 5173;

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
      const { question, selectedOption, userNote } = req.body;
      if (!question) {
        return res.status(400).json({ error: "缺少题目信息" });
      }

      const prompt = `你是一位顶级大厂测评/公考行测名师兼 AI 学习教练。请对以下测评题目进行深度拆解和保姆级教学。

【题目信息】
- 题型：${question.category === 'verbal' ? '言语理解与推理' : question.category === 'data' ? '资料分析与计算' : '图形推理空间思维'}
- 具体考点：${question.subCategory || '核心考点'}
- 难度：${question.difficulty || '未知'}

【题干】
${question.stem}
${question.stemImages?.length ? `（题面配图：${question.stemImages.length} 张，已在前端渲染，无需重复描述图片内容）` : ''}

【选项】
${question.options?.map((opt: any) => `${opt.key}: ${opt.content}`).join('\n')}

【官方正确答案】${question.correctAnswer}
【用户所选答案】${selectedOption || '未作答'}
${userNote ? `【用户疑问/笔记】${userNote}` : ''}

请以结构化、生动易懂的 Markdown 格式输出以下内容（标题用粗体，关键结论用加粗/列表突出，避免冗长）：
1. 🎯 **考点透析与破题眼**：一句话直击本题考查的核心思维模型与切入点。
2. 💡 **思维链完整推导 (Step-by-Step CoT)**：
   - 言语题：找出关键词/关联词/中心句，说明排除与选择的完整逻辑链。
   - 资料题：列公式 → 代入数字 → 秒算技巧（百化分、截位直除、放缩法）→ 得出答案。
   - 图推题：先描述“第一眼特征”（元素组成相似/凌乱、黑白色块、对称性），再给出每一步变化规律。
3. ❌ **易错选项排雷**：逐项说明干扰项错误类型（偷换概念/无中生有/强加因果/计算陷阱/视觉误导）。
4. 🚀 **秒杀口诀与同类题避坑指南**：一句好记的秒杀法则 + 遇到同类题应优先验证什么。
5. 📝 **举一反三变式思考**：给出一个考查相同原理的变形思路，帮助用户迁移。`;

      const explanation = await generateText({
        prompt,
        system:
          "你是一位专业、循循善诱的北森测评与行测大厂题库专家。你的讲解必须基于题目给出的真实数据与选项，绝不编造题干不存在的数字或图形；输出使用清晰的 Markdown 结构、加粗重点、分步推导，像一位耐心的名师带学生复盘。始终以「AI 学习导师」自称，不要提及或透露底层模型、服务商或引擎名称。",
        temperature: 0.4,
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

      const prompt = `你是一位专注于图形推理（图推）的资深教练。针对以下图形推理题，请提供一套系统化的“视觉解构与规律提炼”，像真实教学一样一步一步拆解。

【题型归类】${question.subCategory}
【难度】${question.difficulty || '未知'}
【题干描述】
${question.stem}
${question.stemImages?.length ? `（题面配图共 ${question.stemImages.length} 张，已在前端展示）` : ''}
${question.explanation ? `【标准解析参考】${question.explanation}` : '（无官方解析，请独立推演）'}

【选项】
${question.options?.map((opt: any) => `${opt.key}: ${opt.content || '选项图形'}`).join('\n')}
【正确答案】${question.correctAnswer}

请详细输出 Markdown 格式：
1. 🔍 **第一视觉特征（一眼定规律）**：拿到题先看什么——元素组成相似看位置/叠加，组成凌乱看数量/属性，黑白分明看位运算，三视图/展开图看空间。
2. 📐 **规律演化逐图拆解**：
   - 明确规律维度（点、线、角、面、素、位移、旋转、翻转、叠加相消、对称性、笔画数、封闭空间等）。
   - 写出每一步演化公式（如 图1 + 图2 − 重叠部分 = 图3；顺时针步长 2；每列黑白异或）。
3. ⚡ **十秒秒杀与排除法**：如何用局部特征（小黑点/折角/奇偶笔画/单一线条）快速排除干扰项，并说明每个错误选项错在哪。
4. 🧠 **思维内化口诀**：总结一条针对该类图形规律的记忆金句。
5. 🧩 **同类题迁移预判**：遇到什么特征时应优先套用该规律。`;

      const analysis = await generateText({
        prompt,
        system:
          "你是图形推理教学专家，擅长把抽象规律拆成可验证的步骤。回答必须紧扣题目真实图形信息，不编造不存在的变化；用 Markdown 结构、加粗重点、分步列表输出。始终以「AI 学习导师」自称，不要提及或透露底层模型、服务商或引擎名称。",
        temperature: 0.3,
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

      const categoryRules = isData
        ? `- 你必须额外生成一个 **chart** 对象：与题干自洽的统计图/表格，且所有数值必须可直接读出。
- chart.type 允许：bar（柱状图）、line（折线图）、pie（饼图）、table（数据表）。
- 柱状/折线：chart.categories 为横轴分类，chart.series 为 1~3 组序列 { name, data }。
- 饼图：chart.categories 为扇区名称，chart.series 仅 1 组。
- 表格：chart.columns 为列头数组，chart.rows 为行数据数组。
- 每个 chart 都需有 title 与 unit；题干、选项、解析中的数字必须能在 chart 中直接查到，绝不出现“鼠标悬停才能看到”或题面未提供的数据。`
        : isGraphic
          ? `- 图推题无法生成图片，用文字精确描述每个图形（形状、黑白、线条数、方向、对称性等）。
- 保持与母题相同的图形规律类别（${originalQuestion.subCategory || '图形规律'}），但换一套全新的图形元素。`
          : `- 言语题保持相同考点（${originalQuestion.subCategory || '言语考点'}）与解题逻辑，换一篇全新文段，题干与选项语气、长度、干扰项手法与真题一致。`;

      // 资料分析变式：要求 AI 输出可直接渲染的统计图 schema
      const chartSchema = isData
        ? `  "chart": {
    "type": "bar",
    "title": "图表标题",
    "unit": "单位（如万元、%、万人）",
    "categories": ["2019", "2020", "2021", "2022"],
    "series": [{ "name": "销售额", "data": [100, 120, 150, 180] }]
  },
`
        : '';

      const prompt = `请根据以下母题的考点和逻辑难度，智能生成一道【全新但考查相同核心逻辑/规律】的高质量变式题，用于用户举一反三练习。

【母题信息】
- 题型：${originalQuestion.categoryName || originalQuestion.category}
- 考点：${originalQuestion.subCategory}
- 难度：${originalQuestion.difficulty || '未知'}
- 母题题干：${originalQuestion.stem}
- 核心规律/公式：${originalQuestion.explanation || '见原题考点'}

【变式生成规则】
${categoryRules}
- 选项数量与母题一致（${originalQuestion.options?.length || 4} 个），干扰项必须具有真实迷惑性。
- 解析要给出完整推导，若含计算请列公式并代入数字。

【必须输出的标准 JSON 格式】
{
  "stem": "完整题干（${isData ? '题干需明确“根据图表回答问题”' : ''}）",
  "category": "${originalQuestion.category}",
  "subCategory": "${originalQuestion.subCategory}",
  "difficulty": "${originalQuestion.difficulty || 'medium'}",
${chartSchema}  "options": [
    { "key": "A", "content": "选项A内容" },
    { "key": "B", "content": "选项B内容" },
    { "key": "C", "content": "选项C内容" },
    { "key": "D", "content": "选项D内容" }
  ],
  "correctAnswer": "A或B或C或D",
  "explanation": "清晰严谨的详细推导解析与秒杀技巧"
}`;

      const text = await generateText({
        prompt,
        json: true,
        temperature: 0.7,
        maxTokens: 4096,
      });

      const parsed = parseJsonLoose(text);
      if (isData && parsed.chart) {
        // 轻量校验：确保图表数据结构完整，前端可直接渲染
        const c = parsed.chart;
        if (!c.type || !c.title) throw new Error("AI 生成的图表缺少 type/title");
        if (c.type === "table") {
          if (!Array.isArray(c.columns) || !Array.isArray(c.rows)) throw new Error("AI 生成的表格数据不完整");
        } else {
          if (!Array.isArray(c.categories) || !Array.isArray(c.series) || !c.series[0]?.data) {
            throw new Error("AI 生成的图表数据不完整");
          }
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

  // AI Mistake Diagnostic & Study Prescription (错题学情深度诊断与提分处方)
  app.post("/api/ai/diagnose", async (req, res) => {
    try {
      const { mistakeSummary, stats } = req.body;

      const prompt = `你是一位顶尖测评教学数据分析师兼考研/大厂测评命题研究员。根据该考生的真实练习数据和错题集，进行多维度学情深度诊断，并生成专属提分策略报告。

【考生真实数据概览】
- 总做题数：${stats?.totalAnswered || 0}
- 整体正确率：${stats?.accuracy || 0}%
- 言语理解正确率：${stats?.verbalAccuracy || 0}%
- 资料分析正确率：${stats?.dataAccuracy || 0}%
- 图形推理正确率：${stats?.graphicAccuracy || 0}%

【错题考点分布与典型错题记录】
${JSON.stringify(mistakeSummary || [], null, 2)}

请输出 Markdown 格式的专业诊断报告（禁止编造数据，所有结论必须从上面真实数据推出）：
1. 📊 **能力画像与薄弱短板诊断**（针对三大板块得分瓶颈，指出最需优先提升的 2 个考点）。
2. ⚠️ **典型思维误区预警**（结合具体错题分析考生掉入的认知陷阱：忽略极端词/图推盲目数线/资分乘除粗心/单位看错等）。
3. 💊 **个性化专项提分处方（7天突破规划）**：按“今天/第2-3天/第4-5天/第6-7天”拆解，每天给具体可执行的刷题与复盘动作。
4. 🚦 **下次做题时的“三秒检查清单”**：给出 3~5 条可立即执行的避错提醒。
5. 🌟 **专属鼓励与心态建议**（真诚、具体，不写空话）。`;

      const diagnosis = await generateText({
        prompt,
        temperature: 0.5,
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

      let system = `你是一位全能耐心的北森/大厂测评与行测智能辅导导师。
职责：解答用户在做题过程中的各种疑问（言语语感、成语辨析、资料分析公式速算、图形推理空间规律等）。

回答规范：
- 紧扣题目真实数据，不编造题干未提供的数字或图形。
- 用户问“为什么不选X”时，必须逐项对比各选项，指出错误类型（无中生有/偷换概念/计算陷阱/视觉误导）。
- 涉及计算时，列公式、代入数字、展示完整计算过程。
- 语气专业幽默、严谨清晰，善用 Markdown 排版、加粗重点、分点列表；篇幅根据问题复杂度控制，不啰嗦。
- 始终以「AI 学习导师」自称，不要提及或透露底层模型、服务商或引擎名称。`;

      if (currentQuestionContext) {
        system += `\n\n【用户当前正在查看的题目上下文】
类别：${currentQuestionContext.categoryName || currentQuestionContext.category} - ${currentQuestionContext.subCategory}
难度：${currentQuestionContext.difficulty || '未知'}
题干：${currentQuestionContext.stem}
选项：${currentQuestionContext.options?.map((o: any) => `${o.key}: ${o.content}`).join('; ')}
正确答案：${currentQuestionContext.correctAnswer}
官方解析：${currentQuestionContext.explanation || '无'}
请结合上述题目上下文为用户解答；若用户问题与该题无关，就按通用导师角色正常回答。`;
      }

      const turns: ChatTurn[] = (messages || []).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        content: String(m.content ?? ""),
      }));

      const reply = await generateText({
        messages: turns,
        system,
        temperature: 0.5,
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

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`AI engine: ${AI_CONFIG.label} (${AI_CONFIG.provider}/${AI_CONFIG.model})`);
  });
}

startServer();
