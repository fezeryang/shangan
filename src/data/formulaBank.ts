export interface FormulaItem {
  id: string;
  category: 'data' | 'graphic' | 'verbal';
  categoryName: string;
  title: string;
  formula: string;
  tags: string[];
  description: string;
  applicationScenarios: string;
  example: string;
  mindShortcut: string;
}

export const formulaBank: FormulaItem[] = [
  // Data Analysis Formulas
  {
    id: 'f-data-01',
    category: 'data',
    categoryName: '资料分析核心公式',
    title: '基期量计算 (Base Period)',
    formula: '基期量 = 现期量 / (1 + r)',
    tags: ['基期量', '速算', '特征分数'],
    description: '已知现期量和同比增长率 r，求基期量。若 r > 0，基期量 < 现期量；若 r < 0，基期量 > 现期量。',
    applicationScenarios: '题干要求“前一年/上年同期/基期的数值是多少”。',
    example: '现期量 52850 万元，增长率 5.4%，基期量 = 52850 / (1 + 5.4%) ≈ 52850 / 1.054 ≈ 50142 万元。',
    mindShortcut: '特征分数法：若 r ≈ 1/n，则 基期量 ≈ 现期量 × n / (n + 1)。如 r=25% (1/4)，基期量 = 现期 × 4/5。',
  },
  {
    id: 'f-data-02',
    category: 'data',
    categoryName: '资料分析核心公式',
    title: '增长量计算与百化分 (Growth Amount)',
    formula: '增长量 = 现期量 × r / (1 + r)',
    tags: ['增长量', '百化分', '秒杀公式'],
    description: '当同比增长率 r 可以转化为常见分数 1/n 时，增长量计算公式化简为：增长量 = 现期量 / (n + 1)；若为减少率 (r = -1/n)，则 减少量 = 现期量 / (n - 1)。',
    applicationScenarios: '求“比上年同期增加/减少了多少万元/人”。',
    example: '现期 3600 万元，同比增长 20% (1/5)，增长量 = 3600 / (5 + 1) = 600 万元。',
    mindShortcut: '百化分速记口诀：16.7%=1/6, 14.3%=1/7, 12.5%=1/8, 11.1%=1/9, 9.1%=1/11, 8.3%=1/12, 7.7%=1/13, 7.1%=1/14。',
  },
  {
    id: 'f-data-03',
    category: 'data',
    categoryName: '资料分析核心公式',
    title: '两期比重差值与升降判断',
    formula: '比重差 = (A/B) × [(a - b) / (1 + a)]',
    tags: ['两期比重', '比重升降', '定性秒杀'],
    description: 'A为部分量现期，a为其增速；B为总量现期，b为其增速。若 a > b，则现期比重上升；若 a < b，则现期比重下降；两期比重差值必定小于 |a - b|。',
    applicationScenarios: '问“某产品占总销售额的比重比上年上升/下降了几个百分点”。',
    example: '出口额占总贸易额比重中，出口增速 a=12%，总贸易增速 b=8%。因 a > b，比重上升；差值必小于 12% - 8% = 4 个百分点。',
    mindShortcut: '判升降看 a 与 b：部分增速 > 整体增速 => 比重上升；比重差值绝对值 < |a - b|。',
  },
  {
    id: 'f-data-04',
    category: 'data',
    categoryName: '资料分析核心公式',
    title: '年均增长率与间隔增长率',
    formula: '间隔增长率 R = r1 + r2 + r1 × r2；年均增长近似公式 r ≈ (末期/初期 - 1) / n',
    tags: ['年均增长', '间隔增长', '复合计算'],
    description: '间隔增长率用于计算跨两期的整体增长率；年均增长率在增长率不大（<10%）时可用算术平均估算。',
    applicationScenarios: '问“隔年增长率”或“近五年年均增长率约为多少”。',
    example: '第一年增长 10%，第二年增长 20%，两年的间隔增长率 R = 10% + 20% + 10%×20% = 32%。',
    mindShortcut: '先加后乘积：R = r1 + r2 + (r1 × r2)。',
  },
  {
    id: 'f-data-05',
    category: 'data',
    categoryName: '资料分析核心公式',
    title: '分数大小比较四大法宝',
    formula: '法宝一：直除首位法；法宝二：化同法；法宝三：差分法；法宝四：交叉相乘法',
    tags: ['分数比较', '速算技巧', '高频'],
    description: '比大小（如 A/B vs C/D）：分子大且分母小的分数必大；若同大同小，使用差分法（(A-C)/(B-D) 与 小分数比）。',
    applicationScenarios: '多地区、多年份、多部门利润率或增长率由高到低排序。',
    example: '比较 3067/2713 与 1452/1280：首位直除均为 1.13，差分法：(3067-1452)/(2713-1280) = 1615/1433 ≈ 1.127 < 1.13。',
    mindShortcut: '一眼定乾坤：先观察量级倍数差，差距小直接截前两位直除比商。',
  },

  // Graphic Reasoning Patterns
  {
    id: 'f-graph-01',
    category: 'graphic',
    categoryName: '图形推理规律图鉴',
    title: '位置变换：旋转、翻转与平移',
    formula: '时针判定法：顺时针/逆时针 + 固定步长（45°/90°/180°/1格/2格/循环绕圈）',
    tags: ['位置规律', '旋转', '平移', '黑白格'],
    description: '图形各元素组成完全相同，仅位置或角度发生改变。重点观察关键特征标（如尖角、黑点、小短线）。',
    applicationScenarios: '图形元素组成高度一致、数量相同，仅指向或所在格位发生变化。',
    example: '九宫格中小黑点每步顺时针沿外围顺走 2 格，白点逆时针走 1 格。',
    mindShortcut: '组成相同看位置：定基准点 -> 抓单一路线 -> 排除干扰项。',
  },
  {
    id: 'f-graph-02',
    category: 'graphic',
    categoryName: '图形推理规律图鉴',
    title: '样式叠加：求同存异与重叠相消',
    formula: '四种叠加法则：①直接叠加(∪) ②去同存异(⊕) ③去异存同(∩) ④自定义运算',
    tags: ['叠加', '求同存异', '重叠相消', '黑白运算'],
    description: '图形外部轮廓相似或内部线条存在交集与重合。重叠相消：两图叠在一起，相同重合线条消除，相异不重合线条保留。',
    applicationScenarios: '九宫格或两段式题型中，前两个图形线条有部分重合，第三个图形线条明显变少或重整。',
    example: '图一 2 条线 + 图二 2 条线（其中 1 条重合）= 图三保留 2 条不重合外侧线。',
    mindShortcut: '同消异存记心间：重叠处划掉，独有处描红，立刻看出第三图。',
  },
  {
    id: 'f-graph-03',
    category: 'graphic',
    categoryName: '图形推理规律图鉴',
    title: '数量关系：点、线、角、面、素',
    formula: '数量五维度：交点/切点、直线/曲线/笔画、直角/锐角/钝角、封闭面/白面/黑面、独立部分/元素种类',
    tags: ['点线面角素', '一笔画', '直角数', '封闭区域'],
    description: '图形组成凌乱且各不相同，优先考察数量特征规律（常呈等差数列 1,2,3,4,5 或奇偶分布或求和常数）。',
    applicationScenarios: '每个图形状各异（如三角形、多边形、汉字、字母混排）。',
    example: '各图内部分割出的封闭面数量分别为 2, 3, 4, (5), 6。',
    mindShortcut: '凌乱不堪数数量：面 -> 线(直曲/一笔画) -> 点(交点/切点) -> 角(直角) -> 素(部分数)。',
  },
  {
    id: 'f-graph-04',
    category: 'graphic',
    categoryName: '图形推理规律图鉴',
    title: '属性规律：对称性、曲直性与开闭性',
    formula: '三大属性：①对称性（轴对称轴方向/数量、中心对称）②曲直性（纯直、纯曲、曲+直）③开闭性（全封闭、全开放、半开）',
    tags: ['轴对称', '中心对称', '曲直性', '属性'],
    description: '图形整体感觉规整平衡时，优先画对称轴（看竖轴、横轴、斜轴还是多条轴）；或者观察线条是直线还是曲线构图。',
    applicationScenarios: '图形非常对称（如五角星、等腰梯形、英文字母 A/M/H 等）或分类分组题。',
    example: '图形全部具有唯一的竖直方向对称轴（心形、凸字、水滴针）。',
    mindShortcut: '规整平衡先画轴：横轴、竖轴、斜45度轴；顺带看看曲与直。',
  },

  // Verbal Reasoning Mindmaps
  {
    id: 'f-verb-01',
    category: 'verbal',
    categoryName: '言语理解破题心法',
    title: '主旨概括题三大核心抓手',
    formula: '抓手一：关联词转折递进（然而/但是/其实/不仅...而且/更）\n抓手二：对策引导词（应当/必须/需要/关键在于）\n抓手三：行文脉络（总分/分总/分总分）',
    tags: ['主旨题', '转折词', '对策句', '行文脉络'],
    description: '转折之后是核心，对策提出是重点。排除无中生有、偷换概念、以偏概全（只讲例子或原因）的干扰选项。',
    applicationScenarios: '题干问“这段文字的主旨是/这段文字旨在说明/对这段话最准确的复述是”。',
    example: '文段虽然前文长篇描述科普文章的枯燥现状，但尾句强调科学为文学提供富矿且作家笔触促进科学，主旨即为二者相互激励。',
    mindShortcut: '转折之后现真身，对策一出选对策；举例背景全是托，主旨紧扣中心句。',
  },
  {
    id: 'f-verb-02',
    category: 'verbal',
    categoryName: '言语理解破题心法',
    title: '细节推断与逻辑陷阱四大排雷法',
    formula: '雷区一：绝对化（只有...才、必然、完全、唯一）\n雷区二：时态混淆（已经完成 vs 将来可能）\n雷区三：因果倒置（A导致B 篡改成 B导致A）\n雷区四：概念偷换（偷换主体或范围）',
    tags: ['细节题', '排雷技巧', '逻辑漏洞'],
    description: '严格对照题干原文，圈出时间状语、程度副词、因果连词，若选项语气过于绝对通常为错误项。',
    applicationScenarios: '题干问“下面推断/理解正确的一项是/下列说法与原文不符的是”。',
    example: '原文说“大强度运动后可能出现短暂易感期”，选项说“一定会生病”，绝对化排除。',
    mindShortcut: '文段没说别脑补，绝对词汇多是坑；时态主体对对碰，客观克制选最佳。',
  },
];
