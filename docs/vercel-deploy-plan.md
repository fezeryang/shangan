# Vercel 部署计划（深度审查版）

> 状态：✅ 已执行完成（2026-09-04）。生产地址：https://shangan-cyan.vercel.app

## 执行结果记录

- **Phase 0–2**：全部完成。项目 `shangan` 已创建并关联 GitHub，7 个环境变量已注入（Production+Preview），函数区域 hkg1。
- **Phase 3 验收**：静态（首页/SPA 回退/515 张 qbank 图）全部 200；`/api/health` 200；`/api/ai/status` 正确返回 glm-5.2 配置；explain、generate-variant（spec→校验→确定性渲染→机械验证全链路）、chat 实测 200。
- **计划外发现（3 个平台坑，均已解决）**：
  1. Vercel 新 Node 运行时逐文件编译 TS 且保留无后缀导入，ESM 解析直接报错 → 改为 esbuild 预打包自包含入口（复用项目既有打包模式）。
  2. `api/index.cjs` 的 `.cjs` 扩展名不被 @vercel/node 识别为函数入口 → 改输出 `api/index.mjs`（ESM）。
  3. 新建项目默认 Deployment Protection 保护的是 per-deployment URL，项目生产域名（shangan-cyan.vercel.app）本身公开，无需改设置。
- **遗留（非部署问题）**：主引擎 muyuan.do 中转站服务端当前不可用（本地 500/超时，Vercel 401 Invalid token），MiniMax M3 兜底按设计无缝接管。中转站恢复后主引擎自动回归，无需改动。
- **最终架构差异**：函数入口为 `apiEntry.ts`（源）→ esbuild → `api/index.mjs`（自包含 bundle，已入库）；`npm run build:api` 由 `vercel.json` buildCommand 触发。
- **Phase 4 待办**：自定义域名（大陆访问 vercel.app 不稳）、API 鉴权/限流护栏（`/api/ai/*` 公网无鉴权）。

## 一、审查发现（按影响排序）

### 上一版计划的错误（已修正）

1. **引擎配置错误**：旧版基于外层过期 `.env.example` 写成 DeepSeek。实际 `shangan/.env`：
   - 主引擎 `AI_PROVIDER=openai` → **glm-5.2 中转站**（`OPENAI_BASE_URL=https://muyuan.do/v1`，OpenAI 兼容协议）
   - **MiniMax M3**（`MINIMAX_BASE_URL=https://api.minimaxi.com/anthropic`，Anthropic 协议）做自动兜底——`generateDetailed()` 主引擎失败自动切换
   - DeepSeek/Gemini 代码路径存在但完全未启用

### 本次新发现的问题

1. **工作区不干净**：`src/data/*.ts` 约 1.3 万行未提交（题库再生成）、`index.html`/`vite.config.ts` 格式化 diff、`AGENTS.md` 未跟踪。Git 集成部署前必须提交。
2. **`minitool/` 不能提交**：AGENTS.md 明确为 `rednote` 分支测试产物，「不要合并回 main」。需加入 `.gitignore`。
3. **双锁文件冲突**：`bun.lock`（AI Studio 脚手架遗留）与 `package-lock.json`（npm）同时被 git 跟踪。Vercel 靠锁文件推断包管理器，二者并存不确定 → 删 `bun.lock`，钉死 npm。
4. **`server.ts` 顶部静态 `import { createServer } from "vite"`**：仅 dev 分支用，但静态导入会把整个 Vite 打进函数 bundle → 改动态导入。
5. **请求体上限**：代码 `express.json({limit:"10mb"})`，Vercel 函数硬上限 **4.5MB**（超限 413）。实测各端点 payload 均 KB 级，不受影响，仅留档。
6. **服务端 serverless-safe（好消息）**：零磁盘 IO、零内存会话状态（chat 历史由客户端每次携带），无需状态迁移。
7. **`dist/qbank-sheets` 是幽灵目录**：`scripts/__render` 开发工具的过期产物，前端零引用。fresh 构建不生成、无需处理。实测 `vite build`：`public/qbank` 515 张图自动进 `dist` ✓。
8. **函数 bundle 小**：`figureEngine` 只 import 本地模块（无 d3），无体积风险。
9. **`.env` 从未进过 git 历史** ✓（`git log --all -- .env` 为空），`.env*` 已 gitignore ✓。

## 二、目标架构

```
浏览器 ──► Vercel CDN（dist/ 静态：SPA + qbank 图片 515 张，共 ~10MB）
       └─► /api/* rewrite ──► 单个 Node Serverless Function（Express 整体挂载）
                                  └─► glm-5.2 中转站(muyuan.do) ─失败─► MiniMax M3 兜底
```

- Express 官方零适配模式：`api/index.ts` 默认导出 express app + `vercel.json` rewrites。不拆多函数、不迁 Next.js。
- **Hobby 免费版即可**：函数上限 300s（AI 调用为 I/O 等待不计主动 CPU，单次 10–60s 富余）；静态 ~10MB 远在免费额度内。

## 三、执行计划

### Phase 0 — 前置（5 分钟）

1. 确认用 Hobby 计划。
2. 认证：`~/.pi/agent/vercel-token`（缺失则在 vercel.com/account/tokens 创建，或 `npx vercel login`）。
3. 确认提交策略：Phase 1 改动 + 现有未提交内容一起 commit 并 push（用户过目后执行）。

### Phase 1 — 代码适配（约 30 行 diff，不碰业务逻辑）

**1.1 `server.ts` 重构**（唯一修改的现有文件）：

- `startServer()` 拆为 `export function buildApp(): Express`（组装全部中间件+路由）+ 独立启动逻辑
- 启动守卫：`if (!process.env.VERCEL) startServer();` —— Vercel 上只导出不 listen，本地 dev/start 行为不变
- dev 分支改 `const { createServer: createViteServer } = await import("vite");`（生产 bundle 不含 vite）
- 生产分支 `express.static(dist)` + SPA fallback 保留（无害：仅 `/api/*` 到达函数）

**1.2 新建 `api/index.ts`**（函数入口）：

```ts
import { buildApp } from "../server";
export default buildApp();
```

**1.3 新建 `vercel.json`**：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- rewrite 顺序即优先级：`/api/*` 先进函数；未命中静态文件的路径回退 `index.html`（SPA history）
- 不写 `functions.maxDuration`——Hobby 默认即 300s

**1.4 仓库清理**：`git rm bun.lock`；`.gitignore` 加 `minitool/`。

**1.5 本地验证闭环**：

```bash
npm run lint && npm test
npm run build && npm start   # 生产模式本地仍正常
```

### Phase 2 — 提交 + 创建 Vercel 项目（15 分钟）

1. 提交并 push：Phase 1 改动 + 既有未提交内容（`src/data/*`、`index.html`、`vite.config.ts`、`AGENTS.md`）。commit 中文 conventional 格式。
2. Dashboard（vercel.com/new）Import `fezeryang/shangan`：Root Directory = 仓库根（默认）、Framework = Vite（自动识别）、Build/Output 由 `vercel.json` 接管。
3. Settings → Environment Variables（Production + Preview 都配，值取自 `shangan/.env`）：

| # | 变量 | 值 | 用途 |
| --- | --- | --- | --- |
| 1 | `AI_PROVIDER` | `openai` | 锁定主引擎走中转站 |
| 2 | `OPENAI_API_KEY` | （.env 中的值） | 主引擎密钥 |
| 3 | `OPENAI_BASE_URL` | `https://muyuan.do/v1` | 中转站地址（openai 模式必填） |
| 4 | `OPENAI_MODEL` | `glm-5.2` | 主引擎模型 |
| 5 | `MINIMAX_API_KEY` | （.env 中的值） | 兜底引擎密钥 |
| 6 | `MINIMAX_MODEL` | `MiniMax-M3` | 兜底模型 |
| 7 | `MINIMAX_BASE_URL` | `https://api.minimaxi.com/anthropic` | 兜底走 Anthropic 协议端点 |

   不配：`PORT`（Vercel 注入）、`NODE_ENV`（Vercel 管理）、其余引擎 key（未启用）。
4. Settings → Functions → Region 选 `hongkong (hkg1)`：用户主要在国内；hkg1 到 muyuan.do / minimaxi.com 均可达。

### Phase 3 — 首次部署与验收（15 分钟）

1. push 后自动构建（或 `npx vercel --prod` 直发）。构建日志确认：npm install（无 bun）、`vite build` 出 `dist`（含 515 张 qbank 图）、`api/index.ts` 函数构建成功。
2. 验收清单：

| 检查项 | 预期 |
| --- | --- |
| `GET /api/health` | 200 JSON（**关键**：验证 rewrite 后 Express 带 `/api` 前缀路由仍匹配；404 见预案） |
| `GET /api/ai/status` | label 显示「自定义中转站 glm-5.2」（环境变量注入正确） |
| 首页 + 刷新任意 SPA 子路由 | 不 404 |
| 任一 `/qbank/*.webp` | 200 |
| AI 详解一次（explain） | 200（主引擎链路通） |
| 举一反三一次（generate-variant） | 200，JSON 解析成功（最长链路：截断重试+修复回路） |
| Functions 日志无 `[AI Fallback]` | 主引擎从 Vercel 区域可达 muyuan.do |

   **预案**（唯一不确定的机械细节）：零适配模式下函数可能收到改写后路径导致 404 → 一行修复：

   ```ts
   const root = express();
   root.use("/api", buildApp());
   export default root;
   ```
1. 验收全绿 → main 分支自动为生产。回滚用 Instant Rollback。

### Phase 4 — 收尾与建议项（不阻塞上线）

- **域名（建议尽快）**：`*.vercel.app` 在大陆常被 DNS 污染，国内用户应绑定自有域名（购买前与用户确认）。
- **成本护栏（建议尽快）**：上线后 `/api/ai/*` 公网无鉴权，任何人可烧 glm-5.2/MiniMax 额度。最低成本方案：`buildApp` 加共享 token 校验中间件。本次不做。
- 监控：Dashboard → Functions 日志，或 `npx vercel logs <url>`；异常先看 `[AI Fallback]` 告警。

## 四、风险登记表

| 风险 | 等级 | 处置 |
| --- | --- | --- |
| Express 路径匹配在零适配模式下 404 | 中 | Phase 3 预案一行修复 |
| muyuan.do 中转站限制来源 IP（本地通、Vercel 不通） | 低 | 验收第 7 项；出现则确认 MiniMax 兜底生效，必要时换区域或中转站放行 |
| 请求体 >4.5MB 被 413 | 极低 | 现有 payload 均 KB 级；未来 diagnose 全量诊断超限需压缩 payload |
| 函数冷启动 ~1s | 极低 | 相对 AI 调用时长可忽略 |
| 13MB PDF / minitool zip 进部署 | 无 | 均在 git 仓库外或将被 gitignore |

## 五、改动总计

改 1 个文件（`server.ts`）、新建 2 个（`api/index.ts`、`vercel.json`）、删 1 个（`bun.lock`）、`.gitignore` +1 行、一次 commit。预计执行 30 分钟内。
