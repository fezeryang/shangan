# 图推实验室深度检查与优化计划（v1）

- **检查日期**：2026-09-02（基于当前 `58f759c` 全量核查）
- **范围**：`src/components/PatternLab.tsx`（695 行，实验室唯一实现）及其全部依赖链路：`App.tsx`（挂载与回调）、`AITutorModal.tsx`（AI 导师）、`PracticeMode.tsx`（作答记录契约）、`prompts.ts` / `server.ts`（`/api/ai/graphic-pattern`）、`src/data/graphicQuestions.ts`（152 题）、`src/data/graphicFigureDescriptions.ts`、`src/data/explanationCleanups.ts`、`src/figureEngine/*`、`AnalyticsView.tsx`、`Header.tsx`
- **关联文档**：`docs/graphic-ai-optimization-plan.md`（AI 能力五阶段计划，其阶段三/四对图推部分未完成，是本实验室最大内容短板的根因，见问题 4）
- **状态**：研究结论 + 待执行计划。本文档只定方案，不含代码改动，供后续 AI 按阶段执行。

---

## 0. 实验室现状一句话

图推实验室 = 4 个考点 tab（重叠相消 / 旋转移动 / 黑白位运算 / 数量规律）×（真题实战卡 + 静态规律演示器），真题卡可交互作答并调用 `/api/ai/graphic-pattern` 做规律透析。**骨架方向正确，但存在 1 个功能性 bug、学习闭环断裂（作答不进任何统计）、24% 考点覆盖缺口、以及 AI 透析对 2/3 真题实际处于「无图形信息」降级状态**。

---

## 1. 问题总览（按严重度排序）

| # | 级别 | 问题 | 一句话结论 |
| --- | --- | --- | --- |
| 1 | **P0 bug** | 切换 tab 后真题卡不换题 | `RealQuestionCard` 只挂载一次，题目 state 与 tab 脱钩，展示上一考点旧题 |
| 2 | **P0 闭环** | 实验室作答不进任何学习数据 | `App.tsx:522` 零 props 挂载：不记录正确率/用时、答错不进错题本、学情看板对实验室完全失明 |
| 3 | **P0 覆盖** | 3 个考点（37/152 题，24%）在实验室不可达 | 分类分组（30 题，第二大考点）、对称曲直（5）、拓扑连接（2）无 tab；figureEngine 已支持全部 8 类，缺口纯接线问题 |
| 4 | **P1 内容** | AI 规律透析的信息底座对真题几乎为空 | 图形描述资产仅 3/152 题；解析清洗资产图推 0/152；100/152 题官方解析 <40 字——透析对 2/3 的题只能输出方法论泛谈，按钮文案「视觉解构」过度承诺 |
| 5 | **P1 功能** | 实验室没有 AI 导师入口、没有举一反三 | 弹窗（4 tab：讲解/图推透析/变式/答疑）与变式生成链路均已存在，实验室只内联复制了其中一个接口，未接线其余能力 |
| 6 | **P2 演示器** | 「位置移动」考点无对应演示器 | tab ② 标称「步长旋转/平移翻转」，但演示器只有旋转+镜像，无平移演示 |
| 7 | **P2 出题** | 随机抽题无记忆 | 仅排除当前题；重叠相消/黑白位运算池仅 10 题，会出现 A→B→A 闪回，且无「未做/做错优先」 |
| 8 | **P2 可访问性** | 演示器图形开关无键盘路径 | 重叠相消的 8 条线靠 SVG click（透明加粗命中区），无 `role`/`aria`/键盘支持 |
| 9 | **P3 体验** | 杂项 | AI 透析无逐题缓存（换一题回来要重新生成）；答错后不能重做本题；演示器为静态样例无法与当前题联动 |

---

## 2. 逐项核查证据

### 2.1 问题 1：切 tab 不换题（功能 bug）

- 挂载点 `PatternLab.tsx:318`：`<RealQuestionCard tab={labUrl} />` 位于所有条件渲染块**之外**，4 个 tab 共用同一组件实例。
- `PatternLab.tsx:47`：`useState<Question>(() => pickQuestion(tab))` 初始化器只在挂载时执行一次；`tab` 变化没有任何同步 effect。
- 后果：从 tab ① 切到 tab ②，题卡仍显示「重叠相消」旧题（含已作答/已展开解析状态），与 tab 标题、考点徽标错位，直到手动点「换一题」。演示器与真题卡「同一规律」的产品叙事直接断裂。
- 修复成本：1 个 prop（`key={labTab}` 触发重挂载）或 1 个 `useEffect` 重抽题。**建议 `key`**，因为重挂载同时清空 selected/revealed/aiAnalysis，语义正确且零状态迁移代码。

### 2.2 问题 2：作答记录链路断裂（学习闭环）

- `App.tsx:522`：`{activeTab === "graphic-lab" && <PatternLab />}` —— PatternLab 是全站唯一**零 props** 的功能视图。对比 `PracticeMode`（同文件 524-534 行）拿到 `onRecordAnswer / onResetAnswer / onAddMistake / onOpenAI / favorites / notes / answeredMap` 全套。
- 作答契约（`PracticeMode.tsx:106-116`）：`onRecordAnswer({ questionId, userAnswer, isCorrect, timeSpentSec, answeredAt })` + 答错自动 `onAddMistake(q.id)`。实验室应复用同一契约，不发明新数据。
- 后果链：
  1. 实验室做题不计入 `StudyStats`（`App.tsx:311-345`）→ 正确率、连续打卡、`categoryStats.graphic` 全部失真；
  2. 答错不进错题本（`mistakeIds`）→ 实验室做错的题在错题本里不存在，无法复习；
  3. `AnalyticsView.tsx:314` 明确引导用户「在图推实验室中多演练」，但演练数据不回流看板——**看板推荐了一个自己看不见的入口**；
  4. 无计时：`timeSpentSec` 是记录契约的一部分（粗心型 vs 卡壳型失分诊断依赖它），实验室现在完全没有。
- 注意：`handleRecordAnswer` 会覆盖同题旧记录（`App.tsx:312-315` 先 filter 再 prepend），实验室重做同题的行为天然兼容，无需改动 App 侧。

### 2.3 问题 3：考点覆盖缺口

题库实测分布（`graphicQuestions.ts`，152 题）vs 实验室 tab 映射（`PatternLab.tsx:21-27`）：

| subCategory | 题数 | 实验室可达 |
| --- | --- | --- |
| 数量规律 | 65 | ✅ tab ④ |
| 分类分组 | **30** | ❌ 无 tab |
| 时针旋转 | 22 | ✅ tab ② |
| 黑白位运算 | 10 | ✅ tab ③ |
| 重叠相消 | 10 | ✅ tab ① |
| 位置移动 | 8 | ✅ tab ②（但演示器不匹配，见问题 6） |
| 对称曲直 | 5 | ❌ 无 tab |
| 拓扑连接 | 2 | ❌ 无 tab |

- 缺口合计 37/152（24%）。**分类分组是第二大考点（占图推 20%）却完全不可达**。
- `figureEngine/spec.ts:77-86` 的 `SUB_CATEGORY_KINDS` 已覆盖全部 8 类（classify / symmetry / topology 生成器均已实现，`check-figure-engine` 在测），即补 tab 只是 UI 映射 + 一个演示器，无引擎工作。
- 附带：`pickQuestion`（`PatternLab.tsx:35-43`）在池空时静默回退到全图推池，会掩盖映射 typo；补 tab 时顺手把回退分支改为仅在开发期兜底即可（或不动，当前 4 池均非空）。

### 2.4 问题 4：AI 规律透析的信息底座（内容质量根因）

这是对用户体验影响最大的一条，且根因在数据资产，不在实验室代码。`/api/ai/graphic-pattern` → `buildGraphicPatternPrompt`（`prompts.ts:347-393`）的信息源优先级：SVG 矢量源码（仅 AI 变式题有）＞ 预提取图形描述（`graphicFigureDescriptions`）＞ 纯官方解析。真题三者只有最后一项，而：

- `src/data/graphicFigureDescriptions.ts`：**仅 3/152 题**（g-2026-001~003 的视觉先验样例），149 题透析时模型对图形一无所知；
- `src/data/explanationCleanups.ts`：303 条清洗稿**全部是言语题（v-*），图推 0 条**；
- 官方解析实测：**100/152 题 <40 字**（去空白后中位数 24 字，最短 2 字），如 g-2026-002 解析止于「右，左，右，左」。

→ 对约 2/3 的真题，透析输出只能是「考点方法论 + 猜测性规律假设」。而按钮文案写着「🔍 AI 规律透析（**视觉解构** + 秒杀排除法）」——运行引擎为纯文本模型（MiniMax），「视觉解构」在无描述资产时是虚假承诺，违反项目自身的「信息边界诚实声明」原则（`prompts.ts` 全部 builder 都贯彻该原则，唯独实验室这个按钮文案绕过了它）。

资产补全的工程设施**已全部就绪**，缺的只是执行：

- `scripts/enrich-figure-descriptions.ts`：MiniMax 视觉离线脚本，支持 `--id` / `--limit=N` / `--confirm-full`，断点续跑（合并已有资产）；
- `scripts/clean-explanations.ts`：MiniMax 文本清洗，同样支持增量（只处理 pending），带防扩写/答案一致性校验；
- 注入逻辑（`figureDescriptionBlock` / `explanationCleanups`）已上线，资产文件一更新，prompt 自动带上。

### 2.5 问题 5：AI 导师与举一反三未接线

- `AITutorModal` 具备 4 个 tab（讲解 / 图推透析 / 举一反三 / 答疑追问），`App.tsx` 的 `handleOpenAI(tab, question)` 已是全站公共入口（PracticeMode / ExamMode / MistakeBook / AIVariantBank 均已接）。
- 实验室内联的 `askAI`（`PatternLab.tsx:69-86`）只复制了 graphic-pattern 一个接口：无逐项排雷讲解、无「为什么选 C」追问、无同考点变式强化——恰是做完真题后最需要的三件事。
- 变式链路（spec→renderer，8 类考点全覆盖）对实验室 115 题可达考点全部可用，纯前端接线。

### 2.6 问题 6/7/8/9：演示器与出题体验

- **问题 6**：tab ② 元数据标称「步长旋转 / 平移翻转」，但演示器（`PatternLab.tsx` 模块2）只有单对象旋转（45°/90°）与水平/垂直镜像，**没有任何平移演示**；而「位置移动」8 题考的是网格坐标循环平移。同理，时针旋转真题的核心技巧「时针法」（固定起点 A→B→C 连线看方向）在演示器里也无序列化呈现——演示的是「单个图形怎么转」，考的是「三个图形之间的步进关系」。
- **问题 7**：`pickQuestion(tab, excludeId)` 只排除当前这一题。重叠相消、黑白位运算池各仅 10 题，抽到刚做过的题概率不低；且抽题策略纯随机，无「未做过优先 / 做错过优先」。
- **问题 8**：重叠相消演示器的线条开关是 SVG `<g onClick>`（透明加宽命中区），无 `tabIndex`、无 `role="switch"`、无 `aria-label`；键盘用户完全不可用。位运算格子是 `<button>`（可用但无 `aria-label`）。项目边界要求「无障碍基本项」。
- **问题 9**（低优先级杂项）：
  - AI 透析结果不缓存：换一题再回来（同题 id）要重新生成、重新等待；
  - 作答后选项 `disabled`，无「重做本题」入口（错题重练场景）；
  - 4 个演示器均为写死样例（固定 8 线 / 固定 2×2 / 固定五边形），无法与当前真题联动——真题图是 PDF 位图，无矢量数据，联动确有天花板，只能做到「按考点 kind 随机化初始状态」（可复用 `figureEngine` 的随机 ruleSpec）。

---

## 3. 实施计划

依赖关系：阶段一、二、三互相独立可并行；阶段四建议在一/二之后（复用接线后的 props）；阶段五收尾。每阶段独立可交付、独立验收。

### 阶段一：修 bug + 接通学习闭环（最高优先级，~40 行）

| # | 任务 | 文件 | 说明 |
| --- | --- | --- | --- |
| 1.1 | **修切 tab 不换题**：`<RealQuestionCard key={labTab} tab={labTab} />` | `PatternLab.tsx:318` | 重挂载即重抽题并清空作答态；一行修复 |
| 1.2 | **作答回调接线**：`PatternLab` 增加 props `onRecordAnswer` / `onAddMistake` / `onOpenAI`（签名照抄 `PracticeMode.tsx:17-18`）；`App.tsx:522` 传入 `handleRecordAnswer` / `handleAddMistake` / `handleOpenAI` | `PatternLab.tsx`、`App.tsx` | 复用现有 handler，App 侧不改任何逻辑 |
| 1.3 | **计时**：`RealQuestionCard` 内记录题目出现→点击作答的耗时（`Date.now()` 差值，秒），随 `onRecordAnswer` 上报；答错时调用 `onAddMistake` | `PatternLab.tsx` | 契约与 PracticeMode 一致（其默认 30s 占位，实验室用真实测量，更好） |
| 1.4 | **AI 导师入口**：作答反馈区加「🎓 打开 AI 导师追问」按钮 → `onOpenAI('chat', question)`；同时把内联透析按钮与 `onOpenAI('graphic', question)` 并存（内联保快，弹窗保全） | `PatternLab.tsx` | 零后端改动 |

**验收**：切任意 tab 题卡立即换成该考点题；实验室作答后学情看板 `graphic` 统计变化、答错题出现在错题本；作答记录含真实 `timeSpentSec`；可从实验室打开 AI 导师追问。
**测试**：`npm run lint` + `npm test` 绿；手动核验记录写入 localStorage（`STATS_STORAGE_KEY`）。

### 阶段二：补齐考点覆盖（~80 行，含 1 个新演示器）

| # | 任务 | 文件 | 说明 |
| --- | --- | --- | --- |
| 2.1 | 新增 tab ⑤「分类分组 / 对称曲直」（`LabTab` 增加 `classify`，`TAB_SUBCATEGORIES.classify = ['分类分组', '对称曲直', '拓扑连接']`，37 题全部可达） | `PatternLab.tsx` | 三个小考点合一个 tab，避免 tab 栏 7 项拥挤；`TAB_META` 配图标与副标题 |
| 2.2 | 新演示器「分类分组」：给出一组 6 图（复用 `figureEngine` 的 shape 随机参数或手写 6 个静态分类卡），点选「按 X 维度分组」即时高亮两组；对称曲直用轴对称/曲直开关演示 | `PatternLab.tsx` | 最小版可为「6 图两两分组」静态卡 + 维度切换按钮；不追求生成器级复杂度 |
| 2.3 | tab ② 补「平移演示」：3×3 网格内一行元素循环右移（步长 1/2 可调），与旋转/镜像并列 | `PatternLab.tsx` | 补齐「位置移动」8 题的演示缺口；实现与位运算格子同构，成本低 |
| 2.4 | （可选）tab ② 增加「时针法」序列演示：图1→图2→图3 箭头按固定步长旋转的三联序列 + 时针方向说明 | `PatternLab.tsx` | 直击时针旋转 22 题核心技巧；若排期紧可并入阶段四 |

**验收**：5 个 tab 覆盖全部 8 个 subCategory（152/152 题可达）；每个 tab 的演示器主题与 TAB 元数据一致；`npm run lint` 绿。

### 阶段三：AI 透析内容底座补全（数据运营任务 + 少量代码）

> 对应 `docs/graphic-ai-optimization-plan.md` 阶段三/四中**图推部分未完成的存量**。工程设施全部就绪，主要成本是离线调用与人工抽检。

| # | 任务 | 命令/文件 | 说明 |
| --- | --- | --- | --- |
| 3.1 | 图形描述资产全量：152 题逐题跑视觉描述，先 `--limit=5` 验证质量再 `--confirm-full`；断点续跑，失败单题 `--id=g-2026-xxx` 补 | `npm run enrich-figures -- --confirm-full` | 预计 152 次视觉调用；产物直接进 prompt（注入逻辑已上线） |
| 3.2 | 解析清洗资产补图推：清洗脚本只处理 pending，重跑即自动覆盖图推 152 题（含 <40 字病句解析的保守理顺） | `npm run clean-explanations -- --confirm-full` | 脚本自带防扩写校验与答案一致性校验 |
| 3.3 | 人工抽检 ≥30 题：描述对照 `public/qbank/*.webp` 原图、清洗稿不引入原解析没有的结论 | 数据侧流程 | 沿用既有计划的抽检协议 |
| 3.4 | **按钮文案诚实化**：无 SVG 且无图形描述的题，按钮文案从「视觉解构 + 秒杀排除法」降为「规律透析（基于解析与方法论）」——客户端可直接 import `graphicFigureDescriptions` 判断（数据文件本就在前端） | `PatternLab.tsx` | 与 prompts 的信息边界声明原则对齐 |

**验收**：`graphicFigureDescriptions` 覆盖 ≥149/152（个别图损毁可 low confidence 兜底）；实验室随机抽 10 道原「<40 字解析」题，透析输出能落到具体图形要素；无资产题按钮不再出现「视觉解构」承诺。
**依赖**：MiniMax key（已有）+ 一次性视觉调用预算；先 `--dry-run` 核对清单。

### 阶段四：出题体验与演示器升级（~60 行）

| # | 任务 | 文件 | 说明 |
| --- | --- | --- | --- |
| 4.1 | **会话级洗牌队列**：每个 tab 维护 Fisher-Yates 洗牌队列，抽尽后重洗，杜绝短池闪回（重叠相消/黑白位运算池仅 10 题） | `PatternLab.tsx` | 替换 `pickQuestion` 的纯随机；无持久化需求，会话内 state 即可 |
| 4.2 | **优先级抽题**：可选「未做优先」（需接收 `answeredMap` prop）；首版仅做未做优先，不做筛选 UI | `PatternLab.tsx`、`App.tsx` | 与 PracticeMode 的 `answeredMap` 同源，props 已在阶段一接通 |
| 4.3 | **AI 透析会话缓存**：`Map<questionId, analysis>` 存组件内存，同题返回不重发请求 | `PatternLab.tsx` | 换题即失效，无需持久化 |
| 4.4 | **重做本题**：作答反馈区加「🔄 重做」按钮，重置 selected/revealed 并重新计时（重做结果照常走 `onRecordAnswer` 覆盖旧记录） | `PatternLab.tsx` | 覆盖语义与 App 侧 filter+prepend 天然兼容 |
| 4.5 | **举一反三入口**：作答反馈区加「🧩 生成同考点变式」→ `onOpenAI('variant', question)` | `PatternLab.tsx` | 全链路已有，纯接线；AI 题库 tab 已支持保存 |

**验收**：连续换题 20 次无短池重复；同题二次透析秒出；重做后看板记录被覆盖而非累计；可从实验室生成并保存变式题。

### 阶段五：无障碍与收尾（~20 行）

| # | 任务 | 文件 | 说明 |
| --- | --- | --- | --- |
| 5.1 | 重叠相消线条开关：外层 `<g>` 改 `<g role="switch" tabIndex={0} aria-label="上边" onKeyDown={Enter/Space}>`，8 个定义已有中文 label 可直接用 | `PatternLab.tsx` | 项目无障碍底线 |
| 5.2 | 位运算格子补 `aria-label`（如「A 图左上格：黑」）、多边形计数滑块补 `<label>` 关联 | `PatternLab.tsx` | 同上 |
| 5.3 | （可选）`pickQuestion` 池空回退分支加 `console.warn`（开发期可见），防未来 subCategory 映射 typo 静默降级 | `PatternLab.tsx` | 一行 |

**验收**：纯键盘可完成「切换线条 → 看结果」全流程；屏幕阅读器能读出开关状态；`npm run lint` + `npm test` 绿。

---

## 4. 明确不做 / 暂不做（避免范围蔓延）

1. **演示器与当前真题图联动**：真题图是 PDF 位图无矢量数据，逐题联动需图像理解，超出纯前端能力；天花板是「按考点随机化演示参数」，价值有限，暂不做。
2. **实验室做题历史持久化页面**：作答记录已进全局 `answerRecords`，错题可去错题本复习，实验室内再造历史列表属重复建设。
3. **运行时多模态**：引擎锁定 MiniMax 纯文本（既有决策），图形信息一律走离线资产，不在本计划重开讨论。
4. **演示器生成器化**：`figureEngine` 是为「出题自洽验证」设计的，直接搬进演示器收益低、耦合高；演示器保持手写静态/半静态实现。

## 5. 风险与决策点

1. **阶段三成本与预算**：152 次视觉调用 + 152 次清洗调用，需确认预算；先 `--limit=5` 试跑并人工核验质量再全量。**这是本计划唯一依赖外部资源（付费调用）的阶段**，若暂缓，则问题 4 只能靠 3.4 的文案诚实化兜底。
2. **分类分组 tab 的演示器形态**（2.2）：静态 6 图卡 vs 复用 figureEngine 随机生成——建议首版静态（决策 ladder：先跑通），生成器化留待有真实使用反馈后。
3. **计时口径**：实验室用真实测量（题卡渲染→作答），PracticeMode 是 30s 占位——两者并存会造成跨视图用时语义不一致；可接受（真实值更优），但诊断 prompt 若引入用时分析需知晓该差异。
4. **tab ⑤ 合并三个小考点**：若后续题库扩充（拓扑连接 >10 题），应拆独立 tab；当前 37 题合并不拥挤。
5. **每阶段完成后跑 `npm run lint && npm test`**；本计划不触碰 `prompts.ts`，无需更新 golden 快照与 `PROMPTS_VERSION`（阶段三只更新数据资产文件，注入逻辑已在测）。

## 6. 建议执行顺序

**阶段一（bug+闭环）→ 阶段三（数据资产，可与阶段二并行启动试跑）→ 阶段二（覆盖）→ 阶段四（体验）→ 阶段五（无障碍）。**
阶段一是用户可感知收益最大的最小改动；阶段三周期最长（离线批处理+抽检），应尽早启动试跑。
