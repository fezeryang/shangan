# 提示词工程评审报告（只发现问题，不含解决方案）

- **评审对象**：`shangan/prompts.ts`（5 个任务：explain / graphicPattern / variant / diagnose / chat）及其在 `server.ts` 的生成链路、前端调用方（`AITutorModal.tsx` / `MistakeBook.tsx` / `PatternLab.tsx`）、题库数据形态（`src/data/*`，共 727 题：言语 321 / 资料 254 / 图推 152）。
- **评审方法**：静态审读全部提示词文本，并与实际数据字段、请求构造、响应消费端逐条对账；不运行模型，结论均以代码证据支撑。
- **评审日期**：2026-09-01。

---

## 总评

提示词体系在**宏观设计**上是及格的：任务分治（每任务独立 system + builder + 登记表）、防泄露护栏（「以 AI 学习导师自称」）、变式题的反背诵约束、JSON 修复回路，都体现了工程意识。但存在一个**贯穿性的落地缺陷**：产品核心题型（图推、资料分析）的信息载体是图片，而整条 AI 链路是纯文本的——大量指令要求模型执行它**根本没有输入**的任务。其次是多个任务存在「指令要求的分析深度 > 提供的数据粒度」的欠接地问题，以及 system 与 user 双份人设/约束的措辞漂移。

---

## P0 —— 动摇核心承诺的问题

### 1. 图像盲区：要求「视觉解构」却从未给模型看图

**问题**：三个生成后端全部只传文本（`server.ts:166` Gemini 仅构造 `parts: [{ text }]`；OpenAI 兼容与 Anthropic 路径同样只发字符串）。而：

- 图推题的题面是 `/public/qbank/*.webp` 图片（`graphicQuestions.ts` 每题 `stemImages`），选项内容是字面占位符 `第 1 个图形`；
- `buildGraphicPatternPrompt`（prompts.ts:113）却要求输出「🔍 第一视觉特征（一眼定规律）」「📐 规律演化逐图拆解」「说明每个错误选项错在哪」；
- 同时 system（prompts.ts:41）又要求「回答必须紧扣题目真实图形信息，不编造不存在的变化」。

**后果**：指令自相矛盾且不可满足。模型实际可用的信息只有 `subCategory` 标签（如「时针旋转」）、题干一句话和官方解析，输出本质是**从答案反推的伪视觉分析**。当官方解析本身残缺时（如 g-2026-004 的解析只有半句话、括号未闭合），「不编造」约束形同虚设。explain 链路同样中招：prompts.ts:93 甚至主动告诉模型「配图已在前端渲染，无需重复描述图片内容」。

### 2. explain 任务既不给图、也不给官方解析，资料分析题无数据源

**问题**：`buildExplainPrompt`（prompts.ts:74-111）注入了题干、选项、正确答案，但**不注入 `question.explanation`**，也不注入图表数据。而资料分析题的关键数字大多只存在于图表图片和官方解析文本中（如 d-2026-001 的四个年份数值仅出现在 explanation 里，stem 无任何数字）。

**后果**：模板第 2 段要求「资料题：列公式 → 代入数字 → 秒算技巧」，模型手里却没有数字；system 又禁止「编造题干不存在的数字」（prompts.ts:38）。两条指令只能违反其一（system 原文见 prompts.ts:38）。对比之下 `buildGraphicPatternPrompt` 反而注入了解析（prompts.ts:124「标准解析参考」）——同一产品内两个任务的接地策略不一致，说明这是遗漏而非设计。

### 3. SVG 安全的唯一防线是提示词，且无代码兜底

**问题**：variant 提示词禁止 SVG 含 `<script>`、`<image>`、外链、动画（prompts.ts 图形专属规则），但 `server.ts` 对返回的 `svg` 字符串**不做任何二次校验/清洗**，前端 `AITutorModal.tsx:555/609` 直接 `dangerouslySetInnerHTML` 注入。

**后果**：一个信任边界（XSS）完全寄托在「模型听话」上。修复回路（`generateJsonSafely`）只管 JSON 语法，不管内容安全；一旦模型被题干/用户文本诱导输出恶意 SVG，没有任何拦截层。这是提示词承诺与工程现实之间最大的裂缝。

---

## P1 —— 显著的质量/正确性风险

### 4. diagnose 要求的分析深度远超提供的数据粒度

**问题**：`MistakeBook.tsx:81-86` 构造的 `mistakeSummary` 每条只含 `subCategory / category / userAnswer / correctAnswer` 四个字段——没有题干、没有选项内容、没有作答用时。而 `buildDiagnosePrompt`（prompts.ts:261-267）要求「结合具体错题分析考生掉入的认知陷阱：忽略极端词/图推盲目数线/资分乘除粗心/单位看错」。

**后果**：凭「错误答案字母 + 考点名」无法定位任何具体认知陷阱，模型只能输出模板化归因；system 里「所有结论必须严格从真实数据推出，绝不编造数据」（prompts.ts:53）再次与任务要求冲突。另：`mistakeSummary` 为空数组时提示词没有降级分支，五大段报告（含 7 天规划）仍会被强制要求输出。

### 5. 项目自有的知识资产完全未接入提示词

**问题**：`knowledgeTaxonomy.ts` 为每个 subCategory 维护了 `keyFormulaOrTip / examWeight / baseAccuracy / subCategoryKeywords`，`formulaBank.ts` 维护了公式、场景、mindShortcut——这两个数据资产只被 UI 组件（FormulaGuide / KnowledgeGraph / QuestionKnowledgeModal）消费，**任何 AI prompt 都没有注入**。

**后果**：diagnose 要求「指出最需优先提升的 2 个考点」，而题库里现成的考点权重体系（examWeight）无人引用；explain 要求「秒杀技巧（百化分、截位直除、放缩法）」，而 formulaBank 里的同名公式库无人引用。模型被要求凭通用知识扮演「题库专家」，与产品自建的知识底座脱节，输出口径也无法与 UI 展示的知识图谱对齐。

### 6. JSON 修复回路丢失全部任务上下文

**问题**：`generateJsonSafely`（server.ts:378-401）首次解析失败后，第二次调用的 user 消息只包含：错误信息 + **前 2500 字符**的残缺输出。母题信息、命题铁律、JSON schema、类别专属规则全部不在修复请求里（system 仍在）。

**后果**：图推变式题含 6+ 个 SVG，JSON 轻松超过 2500 字符——模型只能看到自己输出的一小半，却要「重新输出完整的、严格的 JSON」，后半段等于凭空重造，命题约束（考点不变、陷阱必变）无从核对。修复成功率与产物质量都不可控。

### 7. 五选项题的 schema 三处互相矛盾

**问题**：题库存在 **25 道 5 选项题**（graphic 23 道 + verbal 2 道，含 `key: "E"`）。而 variant 提示词中：① JSON 示例固定画了 4 个选项；② `"correctAnswer": "A或B或C或D"` 枚举漏了 E；③ 图形规则文本又写「选项 A-E 每个都要有独立 svg」；④ 通用规则写「选项数量与母题一致（N 个）」。

**后果**：对 5 选项母题，四条指令互相打架，模型行为不可预测（可能截成 4 选项、可能 correctAnswer 落在不存在的 E 上）。服务端校验也不查选项数量与 correctAnswer 的对应关系。

### 8. chart 数据契约仅靠模型自觉，前端静默纠错掩盖违约

**问题**：提示词要求「题干、选项、解析中的数字必须能在 chart 中直接查到」，但 server.ts 的校验只查 `type/title/series[0].data` 存在性；前端 `AITutorModal.tsx` 的 `row[s.name] = s.data?.[i] ?? 0` 会把 series 与 categories 长度不匹配的数据**静默填 0** 渲染。

**后果**：数字一致性（本题的命门：资料分析题的答案必须能从图上算出来）零校验；模型输出缺一个数据点，前端就画出一道值为 0 的柱子，用户按图解题必然算错，且无任何告警。

### 9. chat 上下文中的占位符选项让「逐项对比」不可执行

**问题**：`buildChatSystemPrompt`（prompts.ts:269-285）把选项以 `A: 第 1 个图形; B: 第 2 个图形; …` 注入，而 CHAT_BASE_SYSTEM 明确要求「用户问『为什么不选X』时，必须逐项对比各选项，指出错误类型」。

**后果**：图推/图表题的追问场景下，模型对比的是四个占位符，只能复述官方解析或编造各选项特征。这恰是「自由智能追问」tab 的主推场景（placeholder 文案本身就引导用户问「为什么不选B选项？」）。

---

## P2 —— 一致性、维护性与成本问题

### 10. system 与 user 双份人设/约束，措辞已发生漂移

- explain：system 说「上岸测评与行测大厂题库专家」（prompts.ts:38），prompt 开头另立人设「顶级大厂测评/公考行测名师兼 AI 学习教练」（prompts.ts:84）——「公考」域与产品「上岸测评」域并不相同；
- diagnose：system 无「考研」，prompt 却写「兼**考研**/大厂测评命题研究员」（prompts.ts:249），引入产品域之外的称谓；
- variant：VARIANT_SYSTEM 的「命题铁律」五条与 builder 内「核心原则」五条是同一组约束的两份近似副本，且细节不一致——「正确选项位置不得与原题一致」只存在于 builder 副本（prompts.ts:212），system 副本没有。

**后果**：同一约束两处维护，未来改一处漏一处的回归风险已经现成；人设漂移会让不同任务的输出语气不可预期。

### 11. explain 模板把三种题型的指令全部塞进同一 prompt

**问题**：`buildExplainPrompt` 第 2 段同时列出言语/资料/图推三套推导要求（prompts.ts:105-107），不按 `question.category` 裁剪；而架构上明明已为图推单设了 `graphicPattern` 任务与专属 system。

**后果**：每题约 40% 的指令与本题无关，浪费 token 且存在走错分支的引导风险；同一道图推题存在两条重叠的 AI 解析入口（explain 的图推分支 vs graphic-pattern tab），输出结构却不同。

### 12. 「避免冗长」与「五段全输出」内在矛盾

**问题**：explain/graphicPattern/diagnose 都强制要求 5 个编号段落全数输出（含每题必有的「秒杀口诀」「思维内化口诀」「鼓励与心态建议」），同时又称「避免冗长」「不写空话」。

**后果**：简单题也会被撑出填充式内容；口诀类段落对不适用的题目只能硬凑，与「名师」人设的严谨性相悖。另外 explain 第 5 段「举一反三变式思考」与独立的 variant 生成器功能重叠，产品内一处功能两个入口两种深度。

### 13. 任务登记表的「唯一来源」声明与实现不符

**问题**：prompts.ts 头注释称「单轮 prompt、多轮 system、是否 JSON 输出，全部由本模块决定」，但 server.ts 的 chat 端点实际使用 `buildChatSystemPrompt()` 动态构建 system，`PROMPT_TASKS.chat.system` 从未被消费；`maxTokens` 仅 variant 声明（8192），explain/graphicPattern/diagnose/chat 均未声明。

**后果**：diagnose（五段报告含表格 + 7 天规划）在 Anthropic 路径吃到默认 `max_tokens: 4096`（server.ts:293），长报告有截断风险；Gemini 路径则完全未设 `maxOutputTokens`。同一任务在不同 provider 下输出上限不一致。

### 14. temperature 0.7 与「严格 JSON + 内嵌 SVG」的目标互相拉扯

**问题**：variant 是全表最高温（0.7），同时承担最严格的格式约束（合法 JSON、SVG 单引号属性、viewBox 规格）。项目专门修建了 JSON 修复回路，本身就是该失败模式高频存在的自认。

**后果**：高温带来的命题创意与格式破损率直接挂钩，修复回路又继承问题 #6 的缺陷，形成「越容易坏 → 修复越没上下文 → 产物越不可控」的链式风险。

### 15. chat 历史无长度管理，上下文成本无界增长

**问题**：`AITutorModal.tsx` 将完整 `chatMessages` 数组（含首条硬编码问候语）全量上送，server 原样转发；system 中每次都重复注入完整题目上下文（题干 + 全部选项 + 解析）。

**后果**：长会话下 token 与延迟线性膨胀，且历史中前几轮的完整题目解析会持续占据上下文，没有任何截断/摘要机制。

### 16. 不可信文本无净化地直拼进提示词

**问题**：`userNote`（用户笔记）、chat 用户消息、以及 PDF 抓取的题干/选项（含 OCR 噪声，如 v-2026-002 选项 B 开头的孤立字符「口」）都直接进入提示词，仅有 `【】` 标签作弱分隔；没有任何「数据段仅为资料、不得覆盖以上规则」的优先级声明。

**后果**：system 中的人设与「不透露底层模型」等护栏可被用户消息中的指令性文本覆盖（低风险场景，但防线为零）；OCR 噪声则直接污染模型对题面的理解。

### 17. 防泄露护栏覆盖不全

**问题**：「始终以『AI 学习导师』自称，不要提及或透露底层模型」出现在 4 个 system 中，唯独 VARIANT_SYSTEM（prompts.ts:43-51）没有——而它的 `explanation` 字段最终会以 Markdown 渲染给用户。

### 18. 提示词契约测试形同虚设（除 variant 外）

**问题**：`scripts/check-prompts.ts` 对 explain/graphicPattern/diagnose 的断言只有 `typeof === 'string'`；对输出侧（五段结构、禁编造、口诀段落等所有 prompt 层承诺）除 variant 的轻量结构检查外零校验。

**后果**：提示词的语义回归（改坏一段模板、删掉一条铁律）不会被任何测试捕获。

### 19. 领域措辞三域混用

**问题**：「上岸测评」（校招/企业测评）、「公考行测」（公务员考试）、「考研」三种域词在不同 prompt 中交替出现（见 #10 的两处证据，及 CHAT_BASE_SYSTEM 的「/大厂测评与行测」）。题库来源是上岸测评 PDF，产品语境应为校招测评。

---

## 附注（范围外，但直接影响提示词效果）

- `server.ts` 的 Gemini 默认模型名 `"gemini-3.7-flash"`（server.ts:77）疑似占位符，现实中无此命名版本——模型配置错误会让最精心设计的提示词跑在错误的对象上。
- `.env.example` 中的 provider 优先级（自动探测顺序 MiniMax > DeepSeek > …）意味着不同部署下同一提示词会跑在不同模型上，而提示词的风格/长度假设（如五段结构、SVG 单引号转义技巧）并未对多模型做差异说明。
