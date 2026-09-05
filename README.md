# 上岸测评

[![Vercel 部署](https://img.shields.io/badge/Vercel-已部署-000000?logo=vercel&logoColor=white)](https://shangan-cyan.vercel.app)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)

> 言语理解 · 资料分析 · 图形推理三科真题练习 × AI 思维链拆解 × 举一反三变式生成的「测-学-练」闭环备考平台。

**在线体验**：<https://shangan-cyan.vercel.app>（数据存本地 localStorage，无账号门槛）

## 功能一览

| 模块 | 说明 |
| --- | --- |
| 题库精练 | 三科 727 道真题（源自题库 PDF 解析），配图 400+ 张 |
| 图推实验室 | 图形推理专项交互实验室 |
| 全真模考 | 限时全真模考 |
| 错题本 | 错题归因与专项复盘 |
| AI 变式题库 | 「举一反三」同考点变式题生成与沉淀 |
| 考点速算宝典 | 分考点公式 / 心法速查 |
| 学情看板 | 真实作答数据驱动的多维学情诊断 |

### AI 能力（服务端代理，密钥永不下发浏览器）

- **AI 逐题详解**：思维链拆解 + 干扰项排雷 + 秒杀技巧
- **举一反三变式**：命题引擎生成同考点变式题；图推走 `ruleSpec → 确定性渲染 → 独立机械验证` 链路，图形由代码渲染并交叉校验
- **图形规律专项分析**、**AI 答疑**（多轮对话）、**学情诊断报告**
- 所有 AI 输出视为不可信：JSON 宽松解析修复、SVG 消毒、变式题独立重推导校验

## 架构

```text
浏览器 SPA ──► Vercel CDN（静态资源：SPA + 题库配图）
          └─► /api/* ──► 单个 Node Serverless Function（Express）
                             └─► 主引擎（OpenAI 兼容中转站）─失败自动切换─► MiniMax 兜底
```

用户进度、错题、笔记、AI 变式题全部存于 localStorage（`shangan_*` 版本化 key），服务端无状态。

## 快速开始

```bash
npm install        # 安装依赖（Node 22+，npm）
npm run dev        # 本地开发（tsx server.ts，Express + Vite 中间件同端口）
npm run build      # 构建前端 dist/ + 服务端 dist/server.cjs
npm start          # 生产模式启动
npm test           # 四个断言检查（prompts / figure-engine / json-loose / analytics）
npm run lint       # tsc --noEmit
```

### 环境变量（`shangan/.env`，参考 `.env.example`）

| 变量 | 说明 |
| --- | --- |
| `AI_PROVIDER` | 主引擎：`gemini` / `deepseek` / `minimax` / `openai`（中转站）/ `anthropic` |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` | OpenAI 兼容中转站（主引擎配置，BASE_URL 必填） |
| `MINIMAX_API_KEY` / `MINIMAX_MODEL` / `MINIMAX_BASE_URL` | MiniMax 自动兜底引擎（Anthropic 协议） |
| `GEMINI_API_KEY` / `DEEPSEEK_API_KEY` / `ANTHROPIC_API_KEY` | 其余可选引擎 |

主引擎失败时自动切换 MiniMax 兜底，无需额外配置。

## 目录结构

```text
server.ts              # 全部 /api/ai/* 路由与多引擎抽象
prompts.ts             # AI 提示词单一来源（PROMPT_TASKS 注册表）
jsonLoose.ts           # AI 输出 JSON 宽松解析与修复
svgSanitize.ts         # AI 输出 SVG 消毒
apiEntry.ts            # Vercel 函数入口源码（esbuild → api/index.mjs）
src/figureEngine/      # 图推命题引擎：spec 校验 → 渲染 → 独立验证
src/data/              # 题库与知识库数据（只读，用 scripts/ 维护）
src/components/        # UI（drawably 手绘组件体系）
scripts/               # 断言测试与题库维护脚本
docs/                  # 设计与计划文档
```

## 部署

已部署在 Vercel（Hobby，函数区域 hkg1）：push 到 `main` 自动出生产，分支/PR 出 Preview。

- 生产地址：<https://shangan-cyan.vercel.app>
- 部署方案与踩坑记录：[docs/vercel-deploy-plan.md](docs/vercel-deploy-plan.md)

## 相关文档

- [AGENTS.md](AGENTS.md) — 工程约束与架构红线（prompt 单一来源、AI 输出不信任链、数据维护脚本化）
- [PRODUCT.md](PRODUCT.md) / [DESIGN.md](DESIGN.md) — 产品定位与视觉体系
- [docs/](docs/) — 模块计划、提示词审计、学情看板设计等
