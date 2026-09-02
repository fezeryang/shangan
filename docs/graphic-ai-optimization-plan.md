# 图推 AI 能力优化：研究结论与实施计划（v2）

- **检查日期**：2026-09-01（基于当前 `58f759c` 代码全量核查；同日按反馈修订 v2）
- **v2 修订**：① 引擎锁定 MiniMax（Anthropic 兼容协议，M 系列纯文本模型），Gemini 暂不考虑——**一切方案不得依赖运行时多模态**；② 新增需求：AI 题库（AI 变式题）需要「解析 + 与 AI 提问」。
- **范围**：`prompts.ts`、`server.ts`、`svgSanitize.ts`、`src/data/graphicQuestions.ts`、`AITutorModal.tsx`、`PatternLab.tsx`、`AIQuestionCard.tsx`、`AIVariantBank.tsx`、`App.tsx`、`public/qbank/`（515 张 PDF 抽取图）、`docs/prompt-engineering-review.md`
- **状态**：研究结论 + 待执行计划。本文档只定方案，不含代码改动。

---

## 0. 四个问题的一句话结论

| # | 问题 | 核查结论 | 根因 |
| --- | --- | --- | --- |
| 1 | 举一反三图形不够复杂，单靠提示词是否不严谨 | **直觉正确，提示词天花板已到**。一次让文本模型输出 6~9 个几何自洽的复杂 SVG（题干序列 + 选项 + 干扰项），超出其能力；且 schema 示例本身是简单图形，反向锚定（审计 V-3） | 生成方式问题，不是措辞问题 |
| 2 | PDF 抽取题目不清晰，当前如何解决、是否用了多模态 | **当前完全没用多模态**。五个 AI 任务全部纯文本，提示词声明「图片不会传输给你」，唯一信息源是官方解析文本——而图推 152 题中 **100 题（66%）解析不足 40 字**（OCR 断句、半截话），「唯一可靠来源」大半是空的 | 信息底座缺失；MiniMax 无视觉，只能走「文本资产 + 一次性外部视觉/人工」补底座 |
| 3 | AI 生成题目的解析缺少排版 | **根因在提示词**。explain 任务有五段 Markdown 结构规范，variant 任务的 explanation 字段只有一句「清晰严谨的详细推导解析与秒杀技巧」，无任何结构指令；前端 `MarkdownRenderer` 已就绪 | 一处提示词缺失 + 无契约断言锁定 |
| 4 | AI 题库题目需要「解析 + 与 AI 提问」 | 解析已有（作答后展示，缺陷即问题 3）；**AI 提问完全缺失**：`onOpenAI` 只接入题库精练/考试/错题本，`AIVariantBank`/`AIQuestionCard` 无任何 AI 导师入口。且变式题图形是 SVG **文本**，本可直接给纯文本模型阅读，当前却按「看不到图」处理 | 入口未接线 + 提示词未利用 SVG 源码这一 ground truth |

---

## 1. 现状核查（证据）

### 1.1 举一反三图形复杂度

生成链路：`AITutorModal → /api/ai/generate-variant → buildVariantPrompt（graphic 分支）→ generateJsonSafely → sanitizeVariantSvgs → 契约校验`。

- 复杂度**唯一的约束手段是提示词**：「图形复杂度对标真题：必须有清晰局部特征（黑点/箭头/折角/斜线/黑白块/旋转步长/叠加消去痕迹），而不是简单单一形状」（prompts.ts graphic 分支）。
- schema 示例是 5 个**极简单笔图形**（裸 rect / circle / polygon / path / ellipse），与「复杂度对标真题」自相矛盾——模型会向示例形态收敛（旧审计 V-3 已点名）。
- 服务端校验只查 SVG **存在性**（`figs.length >= 2`、`o.svg` 非空，server.ts），不度量复杂度、更不校验规律自洽性（正确选项是否真的满足规律、干扰项是否真的不满足——全靠模型自觉）。
- 三重结构性矛盾：
  1. **自洽难**：题干序列按规律演化 + 正确选项满足规律 + 干扰项各有设错方式，这是一套几何约束系统，文本模型在 0.6 温度下一次写对的概率随复杂度上升快速衰减；
  2. **预算矛盾**：图形越复杂 token 越多，与 maxTokens 8192 对撞（审计 V-1，截断检测已加，但「精简指令」重试又直接牺牲复杂度——两头拉扯）;
  3. **示例锚定**：示例越简单越稳、越复杂越坏，与目标反向。

**结论：继续加提示词是在错误层面加码。复杂度和自洽必须由代码保证，模型只做它擅长的（命题参数设计 + 文字）。**

### 1.2 题目清晰度与多模态现状

- 图片资产齐全：152 道图推题的题面图已抽取为 `public/qbank/*.webp`（515 张，含资分图表题），**就在本地磁盘上，但从未进过任何 AI 请求**。
- `server.ts` 三个后端（Gemini SDK / OpenAI 兼容 / Anthropic 兼容）的消息构造全部是 `[{ text }]`，无 `inlineData`/`image_url`——**多模态能力零使用**。
- 现行替代方案 =「信息边界声明 + 诚实降级」（这套设计本身是对的，是旧审计 P0-1 的修复成果）：
  - explain / graphicPattern / chat 三任务声明「你看不到任何图形，图形信息以官方解析原文为准」；
  - 解析残缺时「不超过 2 个假设 + 标注需对照原图验证」；
  - 实测降级是**高频路径**：图推 100/152（66%）解析 < 40 字，平均仅 ~294 字且多为 OCR 病句（如 g-2026-002 解析止于「右，左，右，左」）。
- 即：对 2/3 的图推题，AI 解析的输入信息接近于「考点标签 + 半句话」，输出只能靠方法论泛泛而谈。
- **MiniMax 约束**：当前引擎 MiniMax M 系列（Anthropic 兼容协议）为纯文本模型，运行时附图不可行；Gemini 用户已明确不考虑。

### 1.3 变式解析排版

- 前端渲染链路无问题：`AIQuestionCard.tsx` / `AITutorModal.tsx` 的变式解析都走 `MarkdownRenderer`（列表/加粗/表格样式齐全）。
- 缺的是**输入侧结构**：`buildVariantPrompt` 的 JSON schema 中 explanation 字段说明仅一句「清晰严谨的详细推导解析与秒杀技巧」。对比 explain 任务的五段规范（🎯考点透析 → 💡思维链 → ❌排雷 → 🚀秒杀 → 📝点拨），variant 完全没有等价约束。
- `check-prompts.ts` 契约断言未覆盖「变式解析须含结构指令」，golden 快照不会提醒这个缺失。

### 1.4 AI 题库的解析与 AI 提问现状

- 解析：`AIQuestionCard` 作答后经 `MarkdownRenderer` 展示 `question.explanation`，链路存在；排版缺陷即问题 3（阶段一修复同时覆盖弹窗与 AI 题库两个消费端）。
- AI 提问：**无入口**。`App.tsx` 的 `handleOpenAI` 仅由 PracticeMode（323/372）、ExamMode（322/465）、MistakeBook（251）调用；`AIVariantBank` 与 `AIQuestionCard` 的 props 均无 `onOpenAI`。
- 被浪费的关键能力：`AITutorModal` 接收 `Question`，而 `AIQuestion extends Question`，**类型上可直接复用**；更重要的是变式题的 `stemFigures[].svg` 与 `options[].svg` 是矢量源码（文本），**纯文本模型可以精确读出几何关系，不需要任何多模态**——但 `buildExplainPrompt` / `buildGraphicPatternPrompt` / `buildChatContextMessage` 对所有 graphic 题一律声明「你看不到任何图形」，把这份 ground truth 也挡在了门外。

---

## 2. 方案研究与选型

### 2.1 问题一：图形复杂度 —— spec → renderer

| 路线 | 做法 | 结论 |
| --- | --- | --- |
| A. 继续提示词 | 加复杂度描述、加 few-shot 复杂示例 | 否：自洽与预算矛盾无法解，不可验证 |
| B. **spec → renderer（选型）** | 模型只输出「规律参数 JSON」（规则类型/步长/元素/干扰方式），服务端**参数化图形生成器**确定性渲染 SVG 序列 + 正确选项 + 结构化干扰项 | 复杂度由代码保证；答案正确性**机械可验证**；图形不再占输出 token；与引擎视觉能力无关（MiniMax 纯文本完全适配） |
| C. 多模态参照 | 附真题图给视觉模型做风格参照 | 否：依赖视觉模型（当前无），且不解决自洽 |

题库图推 subCategory 实测分布（决定生成器分期）：

| subCategory | 题数 | 生成器难度 |
| --- | --- | --- |
| 数量规律 | 65 | 中（元素计数递变，形状随机、数量受控） |
| 分类分组 | 30 | 低（按属性维度出两类各 N 图） |
| 时针旋转 | 22 | 低（角度参数化箭头/指针） |
| 黑白位运算 | 10 | 低（像素网格与/或/异或，天然可验证） |
| 重叠相消 | 10 | 中（两图叠加去同存异） |
| 位置移动 | 8 | 低（网格坐标循环平移） |
| 对称曲直 | 5 | 低（对称轴数/曲直属性） |
| 拓扑连接 | 2 | 中（连接关系变换） |

**前 4 类（127/152 = 84% 覆盖）先行**；未覆盖类型暂留「模型直出 SVG + 服务端复杂度度量校验（绘制指令数 ≥ 阈值，不达标带反馈重试一次）」过渡兜底。模型新职责：输出 `{ ruleSpec, stem, optionTexts(陷阱设计说明), explanation }`——命题参数 + 全部文字；图形与正确性由代码闭环。

### 2.2 问题二：题目清晰度 —— MiniMax 无视觉下的路线

| 路线 | 做法 | 评价 |
| --- | --- | --- |
| A. 运行时多模态 | 请求内嵌原图 | **出局**：MiniMax 无视觉、Gemini 不考虑 |
| B. **OCR 解析清洗资产（先行，零依赖）** | 离线用 MiniMax **文本**把 727 题的病句解析（断行、半截话、口语碎片）整理为连贯清洗稿，存 `src/data/` 资产注入 | 不新增图形信息，但把「唯一可靠来源」从 66% 半截话变成可读文本；**当前引擎立刻可做**；仍需人工抽检防失真 |
| C. 图形描述资产（增强，已定来源） | 一次性用 **MiniMax 视觉模型**（用户已确认可用）逐题产出结构化图形描述 | 补上真正的图形信息；运行时引擎不变（视觉只用于离线跑一次）；注：视觉接口为 MiniMax 官方平台接口，与当前 Anthropic 兼容 coding plan 端点不同，key 复用性与模型名需先验证 |

**选型：B 立即做；C 视觉来源已定为 MiniMax 视觉模型。** 两者产物都是 `src/data/` 下的不可信参考资产，注入规则一致：

- 进 user 数据段并就地标注「预提取参考数据，可能有误，以原图为准」，不得进 system（沿用审计 C-1 结论）；
- 资产结构：`{ questionId, figureSummary?, cleanedExplanation?, confidence }`；
- 注入点：`buildGraphicPatternPrompt` / `buildExplainPrompt` / `buildChatContextMessage` / `buildVariantPrompt`（graphic 母题上下文——同时反哺问题一：模型命题时终于知道母题图形长什么样）；
- 边界声明双档：有资产题改为「以下是预提取的图形描述/清洗解析（可能不准），原图未传输」，降级协议保留。

### 2.3 问题三：解析排版 —— 单点修复

- 在 `buildVariantPrompt` 的 explanation 字段规范中给出**分考点结构**（对齐 explain 的五段风格但更短）：
  - 资分/言语：**考点定位** → **推导过程**（列公式/代入，分步）→ **逐项排雷** → **秒杀口诀**；
  - 图推：**考点定位** → **规律推导**（必须逐步引用 `stemFigures` 的 label「图1→图2→图3」与演化维度）→ **逐项排雷**（引用选项字母与设错方式）→ **秒杀口诀**；
  - 明确「字段内用 `\n` 分段、`**加粗**` 重点、有序列表分步」的 Markdown 要求。
- `check-prompts.ts` 加断言：variant prompt 必须包含解析结构指令与「图1」引用要求（graphic 分支）；`UPDATE_PROMPT_SNAPSHOT=1 npm test` 更新 golden，`PROMPTS_VERSION` 递增。
- 前端零改动（MarkdownRenderer 已就绪）。

### 2.4 问题四：AI 题库「解析 + AI 提问」—— SVG 源码注入 + 入口接线

核心洞察：**变式题的图形就是 SVG 源码（文本），MiniMax 可以直接精确阅读**——AI 题库的「与 AI 提问」是唯一不需要多模态、也不需要外部资产就能获得真图形信息的场景。

- **入口接线**：`App.tsx` 给 `AIVariantBank` 传 `onOpenAI`，透传到 `AIQuestionCard`（卡片操作区加「问 AI」按钮）→ 打开现有 `AITutorModal`（`AIQuestion extends Question`，类型直接兼容）；变式 tab 对 AI 题库题目隐藏（避免「变式的变式」歧义，首版从简）。
- **提示词注入**：三个 builder（explain / graphicPattern / chat）新增分支——当题目携带 `stemFigures`/`options[].svg` 时，把 SVG 源码作为「图形矢量原始数据」注入 user 数据段，边界声明改为「本题图形以 SVG 矢量源码提供，可精确读取坐标/形状/数量关系，无需想象」；同时保留「解析残缺时假设上限」降级协议。
- **token 有界**：单个 SVG 160~600 字符 × 6~9 个 ≈ 1.5~5k 字符，注入前做长度封顶（超长 SVG 优先注入题干序列，选项截断标注）。

---

## 3. 实施计划（按依赖与收益排序，独立可分批执行）

### 阶段一：变式解析排版（问题三，最小改动先行）

| # | 任务 | 文件 |
| --- | --- | --- |
| 1.1 | explanation 字段增加分考点 Markdown 结构规范（含图推「逐步引用图1/图2 label」要求） | `prompts.ts`（buildVariantPrompt） |
| 1.2 | 契约断言：变式解析结构指令存在 + graphic 分支含 label 引用要求；golden 快照更新，`PROMPTS_VERSION` 递增 | `scripts/check-prompts.ts`、`scripts/prompts.snapshot.txt` |
| 1.3 | 人工验收：图推/资分各生成 3 道变式，检查解析分段、加粗、图序引用 | 运行态 |

**验收**：变式解析在弹窗与 AI 题库卡片中呈分段结构；图推解析能落到「图1→图2 具体怎么变」；`npm test` 绿。
**规模**：~30 行提示词 + ~10 行断言。

### 阶段二：AI 题库「AI 提问」+ SVG 源码注入（问题四，v2 新增）

| # | 任务 | 文件 |
| --- | --- | --- |
| 2.1 | `App.tsx` 给 `AIVariantBank` 传 `onOpenAI`；`AIVariantBank` → `AIQuestionCard` 透传；卡片加「问 AI」按钮；AITutorModal 对 AI 题隐藏变式 tab | `App.tsx`、`AIVariantBank.tsx`、`AIQuestionCard.tsx`、`AITutorModal.tsx` |
| 2.2 | explain / graphicPattern / chat 三 builder 新增 SVG 注入分支与对应边界声明（含长度封顶） | `prompts.ts` |
| 2.3 | 契约断言：带 SVG 题的 prompt 含矢量数据段与「可精确读取」声明；无 SVG 题仍走旧边界声明；快照 + 版本递增 | `scripts/check-prompts.ts` |
| 2.4 | 人工验收：AI 题库中图推题「问 AI」，AI 能具体描述图1→图2 的几何变化（读 SVG 而非泛泛方法论） | 运行态 |

**验收**：AI 题库任意题可打开 AI 导师（讲解/图推透析/答疑三个 tab）；图推追问能落到具体图形要素；`npm test` 绿。
**规模**：前端接线 ~30 行 + 提示词分支 ~40 行 + 断言 ~15 行。

### 阶段三：OCR 解析清洗资产（问题二先行部分，MiniMax 文本即可）

| # | 任务 | 文件 |
| --- | --- | --- |
| 3.1 | 离线批处理脚本：MiniMax 文本逐题清洗 727 题解析（去断行/连贯通顺/保留原意不补造），产出 `src/data/explanationCleanups.ts` | 新 `scripts/clean-explanations.ts`、新 `src/data/explanationCleanups.ts` |
| 3.2 | 注入改造：explain / graphicPattern / chat / variant 的「官方解析」段优先用清洗稿，就地标注「OCR 清洗稿，以原 PDF 为准」 | `prompts.ts` |
| 3.3 | 契约断言 + 快照 + 版本递增 | `scripts/check-prompts.ts` |
| 3.4 | 人工抽检 ≥30 题：清洗稿不得引入原解析没有的结论（防清洗变编造） | 数据侧流程 |

**验收**：图推解析任务对「<40 字病句解析」题输入可读；抽检零编造；`npm test` 绿。
**依赖**：MiniMax key（已有），一次性文本调用成本（727 题 × 1 次）。

### 阶段四：图形描述资产（问题二增强部分，视觉来源待决策）

| # | 任务 | 文件 |
| --- | --- | --- |
| 4.1 | 接入 MiniMax 视觉模型（官方平台视觉接口，读 webp 转 base64 附图；先验 3 题校验模型名/端点/key 复用性，再全量跑） | 待定（仅脚本内部，不影响运行时引擎） |
| 4.2 | 离线脚本产出 `src/data/graphicFigureDescriptions.ts`（结构化图形描述 + confidence），152 图推题全量，可选扩展 254 资分图表题 | 新 `scripts/enrich-figure-descriptions.ts`、新数据文件 |
| 4.3 | 注入改造（与阶段三同模式）+ 契约断言 + 快照 | `prompts.ts`、`scripts/check-prompts.ts` |
| 4.4 | 人工抽检 ≥30 题对照 webp 原图核验 | 数据侧流程 |

**验收**：图推解析任务对解析残缺题也能给出具体到图形要素的推导（抽查 10 题对照原图无误述）。

### 阶段五：spec → renderer 图形引擎（问题一主干）

| # | 任务 | 文件 |
| --- | --- | --- |
| 5.1 | 规律 spec 类型定义（8 类 subCategory 的参数 schema） | 新 `src/figureEngine/spec.ts` |
| 5.2 | 参数化生成器**首批 ×4**（数量规律 / 分类分组 / 时针旋转 / 黑白位运算）：输出 stemFigures SVG + 正确选项 + 结构化干扰项 + 机器可读规律描述；**第二批 ×4**（重叠相消 / 位置移动 / 对称曲直 / 拓扑连接）同一 spec 架构补齐全部 8 类 | 新 `src/figureEngine/generators/*.ts` |
| 5.3 | 自洽验证器：按 spec 推导正确答案，断言与 correctAnswer 一致（进 `npm test`，纯函数无外部依赖） | 新 `src/figureEngine/verify.ts` |
| 5.4 | variant-graphic 链路改造：模型输出 ruleSpec + 文字，服务端渲染组装最终题目 JSON；非覆盖 subCategory 走旧链路 + 复杂度度量校验（绘制指令数阈值，不达标带反馈重试一次） | `prompts.ts`、`server.ts` |
| 5.5 | 契约断言 + 快照：新 prompt 含 spec schema；兜底校验有畸形样本回归 | `scripts/check-prompts.ts` |
| 5.6 | 人工盲评：新旧链路各 10 题（覆盖 4 类），按「真题相似度 / 规律可解性 / 干扰项迷惑性」评分 | 运行态 |

**验收**：首批 4 类考点的变式图形元素密度对标真题（盲评多数胜出）；正确答案 100% 满足规律（验证器保证）；截断报错率显著下降（图形不再占输出 token）；第二批补齐后 8 类全覆盖，未覆盖类型兜底链路仅作降级保留。
**规模**：最大单期，生成器是纯函数、可测、无外部依赖；建议独立分支开发。
**协同**：阶段五落地的变式题天然携带 spec 与 SVG 源码，阶段二的「问 AI」直接受益（注入 SVG 而非描述）。

---

## 4. 风险与待决策点

1. **清洗/描述资产的失真风险**：模型整理 OCR 也可能改错原意。缓解：清洗规则写死「只理顺语言、不得新增结论」+ confidence 字段 + 人工抽检 + 注入时永久标注「以原图/原 PDF 为准」，降级协议不撤。
2. **MiniMax 视觉接口验证**：用户已确认视觉可用；剩余风险是工程性的——视觉接口与当前 Anthropic 兼容 coding plan 端点不同，模型名/计费/key 复用需在阶段四 4.1 先验 3 题确认后再全量。
3. **阶段五工程量**：4 个生成器 + spec 设计是本计划最大投入。若要压缩，最小可行集 = 数量规律 + 黑白位运算（75 题，49% 覆盖，且二者最易机械验证）。
4. **SVG 注入 token 有界性**：单个 SVG 160~600 字符 × 6~9 个，需长度封顶（题干序列优先，选项超长截断标注）。
5. **版本管理**：每个阶段都动 `prompts.ts`，各自递增 `PROMPTS_VERSION` 并更新 golden 快照，不合并混提。
6. **数据不可变原则**：`graphicQuestions.ts` 是「与 PDF 严格对齐」的只读资产（文件头声明），清洗稿/描述只放新资产文件，**不回写题库**。

## 5. 执行顺序建议与确认点

**建议顺序：阶段一 → 阶段二 → 阶段三 → 阶段四 → 阶段五。** 阶段一、二、三均无新依赖、可立即开工；阶段四先做视觉接口先验（3 题）再全量；阶段五独立分支开发，且越晚做越能吃到前面阶段的资产红利。

已确认决策：

- [x] 阶段四视觉来源：**MiniMax 视觉模型**（离线一次性使用，运行时引擎不变）
- [x] 阶段五生成器范围：**首批 4 类 + 第二批补齐全部 8 类**
- [x] AI 题库「问 AI」入口：卡片按钮打开现有 AI 导师弹窗（隐藏举一反三 tab）——用户已认可，阶段二按此执行
