import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

type AIProvider = "gemini" | "deepseek";
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
}

const DEEPSEEK_LABELS: Record<string, string> = {
  "deepseek-chat": "DeepSeek Chat",
  "deepseek-reasoner": "DeepSeek Reasoner",
};

function resolveAIConfig(): { provider: AIProvider; model: string; label: string } {
  const explicit = process.env.AI_PROVIDER?.toLowerCase();
  const provider: AIProvider =
    explicit === "deepseek" || explicit === "gemini"
      ? (explicit as AIProvider)
      : process.env.DEEPSEEK_API_KEY
        ? "deepseek"
        : "gemini";

  const model =
    provider === "deepseek"
      ? process.env.DEEPSEEK_MODEL || "deepseek-chat"
      : process.env.GEMINI_MODEL || "gemini-3.7-flash";

  const label =
    provider === "deepseek"
      ? DEEPSEEK_LABELS[model] || `DeepSeek ${model}`
      : model
          .replace(/^gemini-/, "Gemini ")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

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

// ---------- DeepSeek backend (OpenAI-compatible API) ----------

async function generateWithDeepSeek(opts: GenerateOptions, model: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY，无法使用 DeepSeek 引擎");
  }
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");

  const messages = [
    ...(opts.system ? [{ role: "system", content: opts.system }] : []),
    ...(opts.messages
      ? opts.messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }))
      : [{ role: "user", content: opts.prompt! }]),
  ];

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts.temperature,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DeepSeek API ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data: any = await res.json();
  const content: string | undefined = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek 返回内容为空");
  }
  return content;
}

// ---------- Unified dispatcher ----------

async function generateText(opts: GenerateOptions): Promise<string> {
  if (!opts.prompt && !opts.messages?.length) {
    throw new Error("generateText 需要 prompt 或 messages");
  }
  return AI_CONFIG.provider === "deepseek"
    ? generateWithDeepSeek(opts, AI_CONFIG.model)
    : generateWithGemini(opts, AI_CONFIG.model);
}

/** Tolerant JSON parsing: strips markdown code fences if present. */
function parseJsonLoose(text: string): any {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

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

      const prompt = `你是一位顶级大厂测评/公考行测名师兼AI学习教练。请对以下测评题目进行深度拆解和保姆级教学。

题目类型：${question.category} (具体考点：${question.subCategory || "核心考点"})
题干内容：
${question.stem}

选项列表：
${question.options?.map((opt: any) => `${opt.key}: ${opt.content}`).join("\n")}

官方正确答案：${question.correctAnswer}
用户所选答案：${selectedOption || "未作答"}
${userNote ? `用户疑问/笔记：${userNote}` : ""}

请以结构化、生动易懂的 Markdown 格式输出以下内容：
1. 🎯 **考点透析与破题眼**：本题考查的核心思维模型与抓手（1-2句话直击要害）。
2. 💡 **思维链完整推导 (Step-by-Step CoT)**：一步步推导过程，尤其是图推的“第一眼特征”或言语的“语境逻辑/转折关系”或资料分析的“秒算速算技巧（如特征分数法、放缩法）”。
3. ❌ **易错选项排雷**：为何干扰项是错的（偷换概念/无中生有/强加因果/计算陷阱）。
4. 🚀 **秒杀口诀/同类题避坑指南**：传授一句好记的秒杀法则。
5. 📝 **举一反三变式思考**：提示一道考查相同原理的变形思路。`;

      const explanation = await generateText({
        prompt,
        system:
          "你是一位专业、循循善诱的北森测评与行测大厂题库专家，擅长使用图文并茂的思维拆解帮助学生快速掌握解题规律与秒杀技巧。",
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
      const { question, patternType } = req.body;
      if (!question) {
        return res.status(400).json({ error: "缺少图推题目信息" });
      }

      const prompt = `你是一位专注于图形推理（图推）的资深教练。针对以下图形推理题，请提供一套系统化的“视觉解构与规律提炼”。

题型归类：${question.category} - ${question.subCategory}
规律机制：${patternType || question.patternRule || "位置变换/叠加相消/属性规律/数量关系"}
题干描述与解析背景：
${question.stem}
${question.explanation ? `标准解析参考: ${question.explanation}` : ""}

选项：
${question.options?.map((opt: any) => `${opt.key}: ${opt.content || "选项图形"}`).join("\n")}
正确答案：${question.correctAnswer}

请详细提供：
1. 🔍 **图形第一视觉特征（一眼定规律）**：拿到这道图推题，第一反应应该观察什么（如：元素组成相似看位置/叠加，组成凌乱看数量/属性）。
2. 📐 **规律演化拆解**：
   - 规律维度（点、线、角、面、素、位移、旋转、翻转、叠加相消、对称性、笔画数等）
   - 每一步/每一行/每一列的具体演化公式（如 图1 + 图2 - 重叠部分 = 图3）。
3. ⚡ **秒杀验证与排除法**：如何利用局部特征（如某个小黑点/折角/单双数）在10秒内快速排除干扰选项。
4. 🧠 **思维内化口诀**：总结一条针对该类图形规律的记忆金句。`;

      const analysis = await generateText({
        prompt,
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

      const prompt = `请根据以下母题的考点和逻辑难度，智能生成一道【全新但考查相同核心逻辑/规律】的高质量变式题，用于用户举一反三练习。

母题类型：${originalQuestion.category} - ${originalQuestion.subCategory}
母题题干：${originalQuestion.stem}
母题考查的核心规律/公式：${originalQuestion.explanation || "见原题考点"}

要求输出标准 JSON 格式，字段严格如下：
{
  "stem": "新题目的完整题干描述",
  "category": "${originalQuestion.category}",
  "subCategory": "${originalQuestion.subCategory}",
  "options": [
    { "key": "A", "content": "选项A内容" },
    { "key": "B", "content": "选项B内容" },
    { "key": "C", "content": "选项C内容" },
    { "key": "D", "content": "选项D内容" }
  ],
  "correctAnswer": "A或B或C或D",
  "explanation": "清晰严谨的详细推导解析与秒杀技巧",
  "skillTip": "针对该考点的一句话核心心得"
}`;

      const text = await generateText({
        prompt,
        json: true,
        temperature: 0.7,
      });

      const parsed = parseJsonLoose(text);
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

      const prompt = `你是一位顶尖测评教学数据分析师兼考研/大厂测评命题研究员。根据该考生的练习数据和错题集，进行多维度学情深度诊断，并生成专属提分策略报告。

考生数据概览：
- 总做题数：${stats?.totalAnswered || 0}
- 正确率：${stats?.accuracy || 0}%
- 言语理解正确率：${stats?.verbalAccuracy || 0}%
- 资料分析正确率：${stats?.dataAccuracy || 0}%
- 图形推理正确率：${stats?.graphicAccuracy || 0}%

错题考点分布与典型错题记录：
${JSON.stringify(mistakeSummary || [], null, 2)}

请输出 Markdown 格式的专业诊断报告：
1. 📊 **能力画像与薄弱短板诊断**（针对三大板块的得分瓶颈深度剖析）
2. ⚠️ **典型思维误区预警**（结合错题具体分析考生是掉入了哪些认知陷阱，如忽略极端词、图推盲目数线、资分乘除粗心）
3. 💊 **个性化专项提分处方（7天突破规划）**
4. 🌟 **专属鼓励与心态建议**`;

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
你的职责是解答用户在做题过程中的各种疑问（包括言语语感、成语辨析、资料分析公式速算技巧、图形推理空间规律探索等）。
语气专业幽默、严谨清晰、善用排版与加粗重点。`;

      if (currentQuestionContext) {
        system += `\n用户当前正在查看/练习这道题目：
类别：${currentQuestionContext.category} - ${currentQuestionContext.subCategory}
题干：${currentQuestionContext.stem}
选项：${currentQuestionContext.options?.map((o: any) => `${o.key}: ${o.content}`).join("; ")}
正确答案：${currentQuestionContext.correctAnswer}
官方解析：${currentQuestionContext.explanation || "无"}
请结合当前题目上下文为用户解答。`;
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
