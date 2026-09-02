# 图推实验室交互式学习改造计划（动画 + 交互 + 引导）

- **制定日期**：2026-09-02（基于 `58f759c` 代码核查 + 网络深度研究，决策经两轮 grilling 全部确认）
- **目标用户**：抽象逻辑/空间想象能力弱、面对图推题「看不懂图形在怎么变」的考生
- **核心思路**：图推规律的本质是**变化过程**（旋转、叠加、递增、平移）——用「步进动画 + 用户操作」把这个变化过程显式呈现出来，而不是让用户在脑内自行想象
- **范围**：`PatternLab.tsx` 及其新增子组件、`figureEngine`（序列渲染扩展）、`App.tsx`（接线）、`AnalyticsView.tsx`（验收视图）
- **关联文档**：
  - `docs/graphic-lab-optimization-plan.md`（上一轮审计）：其阶段一/二（P0 修复）被本计划吸收为阶段 0；其阶段三（AI 数据资产）、阶段四（出题体验）与本计划**正交**，仍独立有效
  - `docs/graphic-ai-optimization-plan.md`：阶段三/四（图形描述/解析清洗资产）仍待执行，影响的是 AI 文字透析质量；本计划**不依赖**这些资产（示意动画由 figureEngine 确定性渲染，不经过 AI）
- **状态**：设计决策全部确认，待执行。供后续 AI 按阶段实施。

---

## 0. 研究依据（决策的证据基础）

| # | 结论 | 证据 | 对设计的约束 |
| --- | --- | --- | --- |
| E1 | 动画总体正效应中等（d=0.37 / g=0.226），但**「呈现变化过程」类内容**恰是动画理论适用域；无伴随文字时效应最大（g=0.883） | [Höffler & Leutner 2007](https://eric.ed.gov/?id=EJ780451)；[Berney & Bétrancourt 2016](https://archive-ouverte.unige.ch/unige:92234) | 动画必须呈现「规律本身的变化」，每步配一句文字引导（不依赖长段解释） |
| E2 | **瞬态信息效应**：动画帧即逝，高元素交互度材料（=图推复杂图形）尤甚 | [Castro-Alonso et al. 2018](https://www.sciencedirect.com/science/article/abs/pii/S0360131511000741)；[Wong et al. 2012](https://doi.org/10.1016/j.learninstruc.2012.05.004) | 禁止自动循环播放作为主形态；步进为主，随时可停、可回看 |
| E3 | 只给控制权无效（30 人仅主动暂停 5 次），**配「何时用/怎么用」策略引导**后理解成绩显著提升（d=0.53~0.68）；分段效应有元分析支持 | [Lin, Liu & Kalyuga 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9610327/)；[Rey et al. 2019](https://doi.org/10.1007/s10648-018-9456-4) | 每步必须有「这步发生了什么」引导文案；默认步进、自动播放仅作辅助且播完停在可回看状态 |
| E4 | 交互深度：操作/生成 > 点选 > 观看（ICAP）；虚拟教具对抽象概念有元分析级正效应 | [Chi & Wylie 2014](https://www.tandfonline.com/doi/abs/10.1080/00461520.2014.965823)；[2025 系统综述](https://www.sciencedirect.com/science/article/pii/S2590291125009180) | 真题位图上给「标注操作」（点数计数/圈选），让用户动手而非只看 |
| E5 | 空间技能可训练（217 项研究元分析）；新手从样例学习获益大，支架须随能力撤除（专长逆转效应） | [Uttal et al. 2013](https://groups.psych.northwestern.edu/uttal/vittae/documents/Themalleabilityofspatialskillsametaanalysisoftrainingstudies.pdf)；[worked-example effect](https://en.wikipedia.org/wiki/Worked-example_effect) | 引导模式做成「预习→跟练→独立」渐退支架，不做成永久保姆 |
| E6 | 工程事实：真题图是 PDF 位图不可动画；figureEngine 可从 ruleSpec 确定性渲染全部 8 类考点 SVG；`motion` 已是依赖 | 项目内核查 | 双轨架构（见 D1）；不新增任何依赖 |

## 0.1 设计原则（由证据直接导出，实施时逐条对照）

1. **变化即动画**：动画只用于呈现规律的变化过程，不做装饰性动效。
2. **步进优先**：默认「上一步/下一步」步进；自动播放是次选项，播完停在可回看状态（E2/E3）。
3. **每步一句引导**：每个步进帧配一句「这步发生了什么」，文案来源为考点方法库（E3）。
4. **隔离高亮**（signaling）：当前步变化的元素高亮、其余元素降透明度；旋转/平移类保留前几步的**残影**（ghost），让轨迹可见（E2，降低元素交互度）。
5. **操作优于观看**：能点的都要能操作——标注工具、步进本身都是交互（E4）。
6. **支架渐退**：引导模式三段式，走完自动回到普通模式（E5）。
7. **信息诚实**：示意动画明确标注「规律示意（非本题原图）」，与项目提示词信息边界原则一致。

## 0.2 已确认决策记录（两轮 grilling，后续 AI 不得重新发起）

| # | 决策点 | 结论 |
| --- | --- | --- |
| D1 | 动画作用对象 | **双轨**：引擎图形（演示器/AI 变式）做精确逐步动画；真题位图配「标注工具箱」（操作代替动画） |
| D2 | 学习流形态 | 保持「真题卡 + 演示器」两件套，**新增可选新手引导模式**（不重构） |
| D3 | 动画控制契约 | **默认步进**，可切自动播放（播完停住可回看） |
| D4 | 作答后交互 | 作答后提供「逐步重演」动画再看文字解析；不做强制微测验 |
| D5 | 覆盖分期 | **高频 4 类先行**：数量规律(65) + 分类分组(30) + 时针旋转(22) + 位置移动(8) = 125/152（82%）；其余 4 类暂留现有静态演示器 |
| D6 | 技术选型 | SVG 状态切换用 **CSS transition**（transform/opacity），编排（残影/拖拽）用已装的 `motion`；**不新增依赖** |
| D7 | 语音旁白 | **不做**（不留接口，后续若要另立计划） |
| D8 | 前置 P0 | 动画计划第一冲程先落上轮审计 3 个 P0（切 tab 不换题 / 作答不进统计 / 考点覆盖缺口） |
| D9 | 标注工具集 | **点数计数器 + 自由圈选画笔**（带撤销/清空）；方向笔不做（该场景由引擎动画覆盖） |
| D10 | 引导模式 | 三段式（预习卡→分步跟练→独立做题）；常驻开关 + 图推正确率 <60% 时横幅建议一次（可永久忽略） |
| D11 | 真题重演内容 | 播**同考点示意动画**（引擎渲染），UI 标注「规律示意（非本题原图）」 |
| D12 | 演示器关系 | 新步进动画**替换**高频 4 类的旧静态演示器；其余 4 类保留旧件 |
| D13 | 验收方式 | 学情看板新增**图推分考点正确率**视图，上线前后同考点正确率对照；不做 A/B 基建 |
| D14 | 动画框架选型（Remotion 类评估，2026-09-02 二次深度研究后确认） | **不引入 Remotion / Liqvid / Motion Canvas / Rive / Lottie / GSAP**，维持 D6（CSS transition + 已装 `motion`）。依据见附录 A；唯一重开条件：未来需要「导出 MP4 讲解视频」或「音画同步旁白」时重新评估 Remotion SSR |

---

## 1. 总体架构

```
PatternLab（实验室主页）
├── RealQuestionCard（真题实战卡，增强）
│   ├── 题面位图 + AnnotateCanvas（标注工具箱，D9）      ← 阶段 2
│   ├── 作答后 → RuleReplay（逐步重演，D4/D11）           ← 阶段 3
│   │     ├─ 引擎图形题：真实 stemFigures 序列回放
│   │     └─ 真题位图：同考点示意动画（引擎渲染，明确标注）
│   └── AI 规律透析 / AI 导师入口（上轮计划阶段一已接）
├── RuleStepper（规律步进器，D3）                          ← 阶段 1，替换高频 4 类旧演示器
│   └── 数据：renderRuleSequence(spec) → [{svg, caption, changedIds}]（figureEngine 扩展）
├── GuidedMode（新手引导，D10）                             ← 阶段 4
│   ├── 预习卡（考点心智模型，静态）
│   ├── 分步跟练（RuleStepper 复用 + 引导文案）
│   └── 独立做题（RealQuestionCard 复用）
└── 引导触发横幅（正确率 <60%，localStorage 可永久忽略）
```

组件拆分原则：`RuleStepper` 是唯一新动画框架；`AnnotateCanvas`、`RuleReplay`、`GuidedMode` 均为它的消费方或纯叠加，各自独立小文件，`PatternLab.tsx` 只做编排。

## 2. 核心组件规格

### 2.1 `RuleStepper`（步进动画框架，阶段 1）

```ts
interface StepState {
  svg: string;              // 该步完整图形（figureEngine 渲染产物）
  caption: string;          // 「这步发生了什么」一句话（来自考点方法库口径）
  changedIds?: string[];    // 相对上一步发生变化的元素 id（用于隔离高亮）
  ghost?: boolean;          // 该步是否显示前步残影（旋转/平移类 true）
}
interface RuleStepperProps {
  steps: StepState[];
  mode?: 'stepper' | 'autoplay';  // 默认 stepper；autoplay 播完停在末帧可回看（D3）
  onStepChange?: (i: number) => void;
}
```

- **交互**：上一步/下一步/重置 + 步序指示（1/4…）；autoplay 模式下每步停留 ≥1.2s，播完停在末帧（E2：不允许无限循环）。
- **动效实现**（D6）：步间切换 = 变化元素 `opacity`/`transform` 的 CSS transition（300~400ms）；残影 = 前几步图形以 `opacity ≤0.25` 叠加；高亮 = 变化元素描边加粗 + 呼吸一次，其余元素降至 `opacity 0.35`。`motion` 仅用于步进编排与残影渐隐。
- **可访问性**：步进按钮原生 `<button>`；图形区配 `aria-live` 朗读 caption；遵守项目无障碍底线。
- **降级**：`prefers-reduced-motion: reduce` 时关闭过渡与 autoplay，仅保留静态步进。

### 2.2 `renderRuleSequence(spec)`（figureEngine 扩展，阶段 1）

```ts
// src/figureEngine/sequence.ts（新增，纯函数）
export function renderRuleSequence(spec: RuleSpec): StepState[];
```

- 复用现有 `renderVariant` 的图形渲染原语，按规律类型生成 4~6 步序列 + 中文 caption：
  - **数量规律**：元素数 3→4→5→?，caption 如「图1→图2：元素数量 +1」；
  - **分类分组**：6 图按维度分两组，逐步点亮同组元素，caption 说明分组依据；
  - **时针旋转**：箭头 θ→θ+45°→θ+90°，残影保留前三步位置，caption 引导「以黑点为基准点顺时针 45°」；
  - **位置移动**：网格元素平移一格，循环回卷时高亮回卷，caption 说明步长与方向。
- caption 文案对齐 `formulaBank`/`knowledgeTaxonomy` 中该考点的核心方法措辞（不新造口径）。
- `changedIds`/`ghost` 由各类型适配器计算（渲染时对元素赋稳定 id）。
- **测试**：扩展 `scripts/check-figure-engine.ts`——对 4 类 spec 各断言：步数 ≥3、每步 svg 非空、caption 非空、changedIds 非空、序列与 verifyVariant 的规律一致（末步 = 正确答案形态）。

### 2.3 `AnnotateCanvas`（真题标注工具箱，阶段 2）

- 绝对定位 SVG 覆盖层，挂在 `RealQuestionCard` 现有 `<img>` 之上（pointer-events 仅工具激活时开启）。
- 工具集（D9）：
  - **点数计数器**：点击落一个带序号的小圆点标记；可开多个命名计数器（线/点/面/角），各自显示当前计数；适配「数量规律」65 题的数数场景；
  - **圈选画笔**：拖拽画椭圆描边（圈重叠区域、对称元素、同组元素）；
  - **撤销/清空**：标注栈 pop / 全清。
- 标注为思考辅助，**会话内存态**，不持久化（YAGNI；错题本已有收藏与笔记承载持久信息）。
- 每题可开关；工具栏 3 个按钮 + 撤销/清空，移动端可用（pointer events）。

### 2.4 `RuleReplay`（作答后逐步重演，阶段 3）

- 位置：`RealQuestionCard` 作答反馈区，置于「官方解析」文字**之前**（D4：先看规律怎么动，再读文字）。
- 引擎图形题（AI 变式）：直接以题面 `stemFigures` + 正确选项构造 steps，真实回放。
- 真题位图：取该题 `subCategory` → 随机 seed 生成一个该考点 ruleSpec → `renderRuleSequence` → RuleStepper 播放；标题固定为「🔄 同考点规律重演（示意，非本题原图）」（D11 信息诚实）。
- 无对应序列渲染器的考点（低频 4 类）：不显示重演区，直接进入文字解析（优雅降级）。

### 2.5 `GuidedMode`（新手引导，阶段 4）

- 入口：实验室 hero 区常驻「新手引导」开关；触发横幅：`categoryStats.graphic` 正确率 <60% 且未永久忽略时展示，横幅含「开始引导」与「不再提示」（localStorage：`lab-guide-dismissed`）。
- 三段式（D10，按考点进行，进度存 localStorage `lab-guide-done:{subCategory}`）：
  1. **预习卡**：该考点「先看什么、按什么顺序排查、一句口诀」+ 一个最简引擎示例图——内容取自 `knowledgeTaxonomy` + `formulaBank`，不新造；
  2. **分步跟练**：RuleStepper 自动以引导文案播一个 worked example，用户点完每一步才能进下一步（E5 样例学习）；
  3. **独立做题**：嵌入现有 `RealQuestionCard`，支架撤除；答对即标记该考点引导完成。
- 走完自动回普通模式（E5 支架渐退，不做永久保姆）。

### 2.6 验收视图（阶段 5，`AnalyticsView.tsx`）

- 图推板块新增**分考点正确率**条形视图：数据源 `answerRecords`（P0 已接入）join `allQuestions` 的 subCategory，展示 答题数/正确率/平均用时。
- 用途：上线前后同考点正确率对照（D13）；同时补齐上轮审计指出的「看板推荐实验室却看不见实验室数据」断层。

---

## 3. 实施阶段（含上轮 P0 吸收）

依赖链：阶段 0 → 阶段 1 →（阶段 2 独立可并行）→ 阶段 3 → 阶段 4 → 阶段 5。

### 阶段 0：P0 前置修复（吸收上轮计划阶段一/二，~120 行）

| # | 任务 | 文件 | 验收 |
| --- | --- | --- | --- |
| 0.1 | 修切 tab 不换题：`<RealQuestionCard key={labTab} tab={labTab} />` | `PatternLab.tsx:318` | 切 tab 立即换题并清空作答态 |
| 0.2 | 作答闭环接线：props 增加 `onRecordAnswer/onAddMistake/onOpenAI`（签名照抄 PracticeMode），App 传入现有 handler；题卡内测量真实用时 | `PatternLab.tsx`、`App.tsx` | 实验室作答进统计/错题本；AI 导师可打开 |
| 0.3 | 考点覆盖：新增 tab ⑤「分类分组/对称曲直/拓扑连接」（`TAB_SUBCATEGORIES` + 最简静态演示卡） | `PatternLab.tsx` | 8 类 subCategory 全部可达（152/152） |
| 0.4 | AI 透析按钮文案诚实化（无图形资产题不写「视觉解构」） | `PatternLab.tsx` | 与 `graphicFigureDescriptions` 覆盖情况联动 |

### 阶段 1：RuleStepper + 序列渲染（核心，~400 行）

| # | 任务 | 文件 | 验收 |
| --- | --- | --- | --- |
| 1.1 | `RuleStepper` 框架组件（步进/自动播放/残影/隔离高亮/aria/reduced-motion） | 新 `src/components/lab/RuleStepper.tsx` | 见规格 2.1；lint/test 绿 |
| 1.2 | `renderRuleSequence` 4 类适配器（数量规律/分类分组/时针旋转/位置移动） | 新 `src/figureEngine/sequence.ts` | 每类 ≥3 步、caption/changedIds 齐全 |
| 1.3 | 契约测试：序列与 verifyVariant 规律一致性断言 | `scripts/check-figure-engine.ts` | `npm test` 绿 |
| 1.4 | 替换高频 4 类旧演示器为 RuleStepper（D12）；旧演示器代码删除，tab ⑤ 与低频类暂留静态卡 | `PatternLab.tsx` | 4 类 tab 均为步进动画；无死代码 |

### 阶段 2：真题标注工具箱（~250 行，可与阶段 1 并行）

| # | 任务 | 文件 | 验收 |
| --- | --- | --- | --- |
| 2.1 | `AnnotateCanvas`：点数计数器（多命名计数）+ 圈选画笔 + 撤销/清空，pointer events，移动端可用 | 新 `src/components/lab/AnnotateCanvas.tsx` | 规格见 2.3 |
| 2.2 | 接入 `RealQuestionCard` 题面图，标注开关 | `PatternLab.tsx` | 真题图上可计数、可圈选、可撤销 |

### 阶段 3：作答后逐步重演（~150 行）

| # | 任务 | 文件 | 验收 |
| --- | --- | --- | --- |
| 3.1 | `RuleReplay`：引擎题真实回放；真题播同考点示意动画并标注「非本题原图」；低频考点优雅降级 | 新 `src/components/lab/RuleReplay.tsx`、`PatternLab.tsx` | 作答后先动画后文字；真题示意动画有诚实标注 |

### 阶段 4：新手引导模式（~250 行）

| # | 任务 | 文件 | 验收 |
| --- | --- | --- | --- |
| 4.1 | `GuidedMode` 三段式（预习卡/分步跟练/独立做题），进度与忽略标记持久化 | 新 `src/components/lab/GuidedMode.tsx` | 规格见 2.5 |
| 4.2 | hero 区开关 + 正确率 <60% 触发横幅（可永久忽略） | `PatternLab.tsx` | 横幅只出现一次；走完自动退出引导 |

### 阶段 5：验收视图（~80 行）

| # | 任务 | 文件 | 验收 |
| --- | --- | --- | --- |
| 5.1 | 学情看板图推分考点正确率视图（题数/正确率/平均用时） | `AnalyticsView.tsx` | 实验室作答后视图即时更新 |

---

## 4. 明确不做（YAGNI 边界）

1. **语音旁白**（D7）：不做，不留接口。
2. **真题位图的规律动画**：位图无法插值，标注操作已覆盖该场景；不做 AI 逐题生成 SVG 再动画（保真度风险 + 付费成本）。
3. **强制微测验**（每步答对才前进）：挫伤弱基础用户，首版不做。
4. **A/B 测试基建**：分考点正确率前后对照已够指导迭代。
5. **标注持久化**：思考辅助是会话态；持久信息走收藏/笔记。
6. **方向笔工具**：时针旋转/位置移动由引擎动画覆盖，真题上价值打折。
7. **低频 4 类（重叠相消/黑白位运算/对称曲直/拓扑连接，27/152）的步进动画**：暂留旧静态演示器；待高频 4 类上线并有使用数据后再决定是否补齐。

## 5. 风险与缓解

1. **动画变成新负担**（E2 风险）：步进为主 + 每步一句引导 + 残影固定轨迹，禁无限循环；上线后看分考点正确率与平均用时双向变化。
2. **示意动画被误认为本题原图**：固定标题「同考点规律重演（示意，非本题原图）」+ 与真题图完全不同的视觉容器（演示器配色而非真题卡片配色）。
3. **caption 文案口径漂移**：统一从 `knowledgeTaxonomy`/`formulaBank` 取措辞，序列渲染器不自带文案库。
4. **性能**：步进是离散状态切换，无长时 rAF 循环；残影最多叠加 3 层 SVG，移动端可承受。
5. **测试约定**：新逻辑的 runnable check 全部挂进现有 `scripts/check-figure-engine.ts`（序列断言），不引入新测试框架；每阶段 `npm run lint && npm test` 必须绿。

## 6. 执行顺序与交付节奏

阶段 0（P0，先修地基）→ 阶段 1（RuleStepper 核心）→ 阶段 2（标注，并行）→ 阶段 3（重演）→ 阶段 4（引导）→ 阶段 5（验收视图）。
每个阶段独立可交付、可验收；阶段 1 完成后用户即可感知核心变化（4 类演示器全部动画化）。

---

## 附录 A：Remotion 类视频框架评估（D14 依据）

**问题**：Remotion（程序化视频框架）这类时间轴/帧驱动工具，是否适合本实验室的步进动画？

**结论：技术可行，选型不适配。不引入。**

| 维度 | 事实核查 | 对本项目的影响 |
| --- | --- | --- |
| 定位 | Remotion 是**视频制作框架**：帧驱动（`useCurrentFrame`/`interpolate`/`Sequence`），核心价值在渲染 MP4（Node/Lambda）；`@remotion/player` 可将 composition 嵌入 React 应用并对 props 响应式重渲（[remotion.dev/player](https://www.remotion.dev/player)） | 我们的交互是「离散、用户步进」（E2/E3 分段原则），不是连续时间轴；用视频框架实现步进 = 逆着框架范式编程 |
| 交互范式成本 | 社区实践：等用户输入再前进需 callback→pause/play 的 workaround 写法；构建者本人追问「该不该用」，Remotion 作者 JonnyBurger 回答「能跑就好，但 Liqvid 更专注交互式视频」（[remotion-dev discussion #3436](https://github.com/orgs/remotion-dev/discussions/3436)） | 作者都不把它定位为交互式 UI 的工具；步进器用原生 DOM 是顺路，用 Player 是绕路 |
| 依赖成本 | `@remotion/player` 依赖 `remotion` core，两包合计 ~1.9MB 源码（npm unpacked：346KB + 1538KB，v4.0.519）；换来的是时间轴、音频、编解码、视频导出等我们全部用不上的能力 | 违反项目「已装依赖能解决就不新增」原则；D6 方案（CSS transition + 已装 `motion`）零新增依赖已覆盖全部需求 |
| 可访问性 | CSS transition 方案下每步是真实 DOM：键盘焦点、`aria-live` 朗读 caption、`prefers-reduced-motion` 全部原生可用 | Player 内需经其 API 重建控件与同步，无障碍实现成本更高 |
| 许可 | 个人与 ≤3 人营利组织免费（[remotion.dev/license](https://www.remotion.dev/license)） | 本项目无许可障碍（非否决项，仅记录） |

**同类工具扫描**（均不引入）：

| 工具 | 一句话判定 |
| --- | --- |
| Liqvid | 作者推荐的「交互式视频」框架，但仍是视频范式重于步进器需求；发布节奏放缓（最近 2025-04），不引入 |
| Motion Canvas | TS 生成器式动画创作 + 视频导出（[motioncanvas.io](https://motioncanvas.io)），canvas 渲染、面向预制讲解视频；与 ruleSpec 动态生成图形的模型不匹配 |
| Rive | 运行时小且活跃（2026-08 仍在发版），但动画须在其 GUI 编辑器中**预制**，无法由代码按 ruleSpec 程序化生成每题图形 |
| Lottie | AE 导出的回放 JSON，同为预制资产，不可程序化生成 |
| GSAP / anime.js | 能用，但与已装 `motion` 能力重复，违反最小依赖原则 |

**重开条件**（满足其一再评估）：① 需要离线批量导出每个考点的讲解 MP4（Remotion SSR/Lambda 恰是其主场）；② 需求变更引入「音画同步旁白」（当前 D7 已明确不做语音）。
