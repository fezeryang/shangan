import { Question } from '../types';

export interface TaxonomyKnowledgePoint {
  id: string;
  category: 'verbal' | 'data' | 'graphic';
  categoryName: string;
  name: string;
  shortName: string;
  examWeight: string;
  description: string;
  keyFormulaOrTip: string;
  baseAccuracy: number;
  prerequisites: string[];
  nextSteps?: string[];
  subCategoryKeywords: string[];
}

export const RAW_KNOWLEDGE_POINTS: TaxonomyKnowledgePoint[] = [
  // --- VERBAL REASONING ---
  {
    id: 'v_main_idea',
    category: 'verbal',
    name: '主旨概括与核心提炼',
    shortName: '主旨概括',
    categoryName: '言语理解与推理',
    examWeight: '高频必考 (20%)',
    description: '抓取文段中心论点、总分/转折/因果结构分析及中心句同义替换。',
    keyFormulaOrTip: '寻找关联词（转折/递进/因果）与对策词（必须、应该、需要），首尾句重点审视。',
    baseAccuracy: 78,
    prerequisites: ['v_logic_fill'],
    nextSteps: ['v_intent_deduction', 'v_sentence_order'],
    subCategoryKeywords: ['主旨概括', '中心理解', '段落大意', '核心观点', '核心提炼'],
  },
  {
    id: 'v_intent_deduction',
    category: 'verbal',
    name: '意图推断与隐含倾向',
    shortName: '意图推断',
    categoryName: '言语理解与推理',
    examWeight: '高频常考 (15%)',
    description: '透过字面意思判断作者真实写作目的、言外之意与倡导呼吁。',
    keyFormulaOrTip: '提出问题→优选解决问题的合理对策项；避免过度推论与主观臆断。',
    baseAccuracy: 72,
    prerequisites: ['v_main_idea'],
    nextSteps: ['v_attitude_stance'],
    subCategoryKeywords: ['意图判断', '意图推断', '言外之意', '隐含倾向'],
  },
  {
    id: 'v_logic_fill',
    category: 'verbal',
    name: '逻辑填空与成语辨析',
    shortName: '逻辑填空',
    categoryName: '言语理解与推理',
    examWeight: '极高频 (25%)',
    description: '上下文语境呼应、成语色彩感情轻重、实词近义词精准搭配。',
    keyFormulaOrTip: '锁定文段中的解释性说明与反义对应词，辨析词义侧重点及适用对象。',
    baseAccuracy: 65,
    prerequisites: [],
    nextSteps: ['v_main_idea'],
    subCategoryKeywords: ['选词填空', '逻辑填空', '成语辨析', '实词填空'],
  },
  {
    id: 'v_detail_verify',
    category: 'verbal',
    name: '细节判断与正误排雷',
    shortName: '细节推断',
    categoryName: '言语理解与推理',
    examWeight: '常考 (15%)',
    description: '文段细节与选项一一对应，识别无中生有、偷换概念与绝对化表述。',
    keyFormulaOrTip: '圈画主体、时间、范围限定词与逻辑关系，警惕“完全、必定、唯一”等极端词。',
    baseAccuracy: 74,
    prerequisites: [],
    nextSteps: ['v_term_comprehension'],
    subCategoryKeywords: ['细节判断', '细节理解', '正误排雷', '细节推断'],
  },
  {
    id: 'v_logic_judgement',
    category: 'verbal',
    name: '逻辑判断与论证评价',
    shortName: '逻辑判断',
    categoryName: '言语理解与推理',
    examWeight: '常考 (10%)',
    description: '削弱/加强论证、前提假设与结论可靠性评价，识别论证漏洞。',
    keyFormulaOrTip: '找论点→拆论据→断桥：削弱针对论证缺口，加强补齐前提链。',
    baseAccuracy: 68,
    prerequisites: ['v_detail_verify'],
    nextSteps: [],
    subCategoryKeywords: ['逻辑判断', '削弱论证', '加强论证', '前提假设', '论证评价', '质疑反驳'],
  },
  {
    id: 'v_sentence_order',
    category: 'verbal',
    name: '语句衔接与顺序排列',
    shortName: '语句排序',
    categoryName: '言语理解与推理',
    examWeight: '技巧型 (10%)',
    description: '首尾句排除法、指代词捆绑、时间/空间/逻辑先后脉络。',
    keyFormulaOrTip: '看首句排除下定义/转折句，抓代词“这、其”与时间先后确定句子捆绑集团。',
    baseAccuracy: 70,
    prerequisites: ['v_main_idea'],
    nextSteps: [],
    subCategoryKeywords: ['语句排序', '语句衔接', '下文推断', '接语推断'],
  },
  {
    id: 'v_term_comprehension',
    category: 'verbal',
    name: '词句理解与代词指代',
    shortName: '词句指代',
    categoryName: '言语理解与推理',
    examWeight: '细节型 (8%)',
    description: '特定专有名词、代词“这/它/此”在具体语境中的精准指向。',
    keyFormulaOrTip: '就近原则定位前句主宾语，结合整句主旨把握象征隐喻含义。',
    baseAccuracy: 82,
    prerequisites: ['v_detail_verify'],
    nextSteps: [],
    subCategoryKeywords: ['词句理解', '代词指代', '词语指代'],
  },
  {
    id: 'v_attitude_stance',
    category: 'verbal',
    name: '态度倾向与情感色彩',
    shortName: '态度观点',
    categoryName: '言语理解与推理',
    examWeight: '综合型 (7%)',
    description: '判断作者对某一社会现象或观点的支持、反对、中立或怀疑立场。',
    keyFormulaOrTip: '注意褒贬色彩词（如“所谓、差强人意、遗憾的是”）以及让步从句“无论...”。',
    baseAccuracy: 76,
    prerequisites: ['v_intent_deduction'],
    nextSteps: [],
    subCategoryKeywords: ['态度观点', '情感倾向', '态度倾向'],
  },

  // --- DATA ANALYSIS & CALCULATION ---
  {
    id: 'd_base_current',
    category: 'data',
    name: '基期量与现期量计算',
    shortName: '基期计算',
    categoryName: '资料分析与计算',
    examWeight: '核心基础 (20%)',
    description: '已知现期与增速求基期量：基期=现期/(1+r)；基期差值速算。',
    keyFormulaOrTip: '截位直除法：分子不变，分母四舍五入保留前3位有效数字。',
    baseAccuracy: 75,
    prerequisites: [],
    nextSteps: ['d_growth_rate', 'd_average_multiple', 'd_mixed_growth'],
    subCategoryKeywords: ['基期量', '基期计算', '现期量', '基期差值', '基期倍数'],
  },
  {
    id: 'd_growth_rate',
    category: 'data',
    name: '增长率计算与大小比较',
    shortName: '增长率比较',
    categoryName: '资料分析与计算',
    examWeight: '极高频 (20%)',
    description: '增长率=(现期-基期)/基期；分数大小快速估算比较。',
    keyFormulaOrTip: '差分法与化同法：分子倍数大于分母倍数则分数值更大。',
    baseAccuracy: 70,
    prerequisites: ['d_base_current'],
    nextSteps: ['d_growth_amount', 'd_proportion_analysis', 'd_interval_growth'],
    subCategoryKeywords: ['同比增长率', '增长率计算', '增长率比较', '复合增长率', '环比增长率'],
  },
  {
    id: 'd_growth_amount',
    category: 'data',
    name: '增长量与百化分秒杀',
    shortName: '增长量秒杀',
    categoryName: '资料分析与计算',
    examWeight: '秒杀必考 (20%)',
    description: '当 r ≈ 1/n 时，增长量 = 现期 / (n+1)；减少量 = 现期 / (n-1)。',
    keyFormulaOrTip: '熟记核心百化分：16.7%=1/6, 14.3%=1/7, 12.5%=1/8, 11.1%=1/9, 9.1%=1/11。',
    baseAccuracy: 64,
    prerequisites: ['d_growth_rate'],
    nextSteps: ['d_proportion_analysis'],
    subCategoryKeywords: ['增长量', '百化分', '增长量比较', '增量计算'],
  },
  {
    id: 'd_proportion_analysis',
    category: 'data',
    name: '比重分析与两期比重升降',
    shortName: '两期比重',
    categoryName: '资料分析与计算',
    examWeight: '高频题型 (15%)',
    description: '部分增长率 a > 整体增长率 b 则比重上升；比重差值 < |a-b|。',
    keyFormulaOrTip: '秒杀口诀：a > b 上升，a < b 下降；差值必然小于部分增速与整体增速之差。',
    baseAccuracy: 68,
    prerequisites: ['d_growth_rate'],
    nextSteps: [],
    subCategoryKeywords: ['比重分析', '两期比重', '现期比重', '基期比重', '比重变化'],
  },
  {
    id: 'd_average_multiple',
    category: 'data',
    name: '平均数与倍数综合计算',
    shortName: '平均数倍数',
    categoryName: '资料分析与计算',
    examWeight: '常考 (10%)',
    description: '平均数=总量/份数；平均数增长率=(a-b)/(1+b)。',
    keyFormulaOrTip: '注意“每”字后为分母；两期平均数增速公式与两期比重一致。',
    baseAccuracy: 76,
    prerequisites: ['d_base_current'],
    nextSteps: [],
    subCategoryKeywords: ['平均数计算', '两期平均数', '倍数计算', '均值比较'],
  },
  {
    id: 'd_mixed_growth',
    category: 'data',
    name: '混合增长率与十字交叉',
    shortName: '混合增速',
    categoryName: '资料分析与计算',
    examWeight: '难点攻坚 (8%)',
    description: '整体增长率介于各部分增长率之间，偏向基期基数大的一方。',
    keyFormulaOrTip: '口诀：居中不正中，偏向基数大。利用十字交叉法定基期比例。',
    baseAccuracy: 58,
    prerequisites: ['d_growth_rate'],
    nextSteps: [],
    subCategoryKeywords: ['混合增长率', '十字交叉法', '混合增速', '线段法'],
  },
  {
    id: 'd_interval_growth',
    category: 'data',
    name: '间隔增长率与复合增速',
    shortName: '间隔增长率',
    categoryName: '资料分析与计算',
    examWeight: '常考 (7%)',
    description: '隔年增长率公式：R = r1 + r2 + r1 × r2。',
    keyFormulaOrTip: '当 r1, r2 均小于 10% 时，r1 × r2 极小可直接略去先算代数和。',
    baseAccuracy: 72,
    prerequisites: ['d_growth_rate'],
    nextSteps: [],
    subCategoryKeywords: ['间隔增长率', '隔年增长率', '间隔倍数', '跨年增长'],
  },
  {
    id: 'd_chart_reading',
    category: 'data',
    name: '复式统计图表极值速读',
    shortName: '图表速读',
    categoryName: '资料分析与计算',
    examWeight: '基础核心 (10%)',
    description: '柱状图、趋势折线图、饼图与双轴图表单位与时间节点排雷。',
    keyFormulaOrTip: '第一步先看图名、时间、单位（万元/亿元/个/人），防止因单位换算失分。',
    baseAccuracy: 84,
    prerequisites: [],
    nextSteps: ['d_base_current', 'd_growth_rate'],
    subCategoryKeywords: ['综合分析', '图表速读', '复式图表', '极值判断', '统计图表'],
  },

  // --- GRAPHIC REASONING ---
  {
    id: 'g_overlay_subtraction',
    category: 'graphic',
    name: '重叠相消与去同存异',
    shortName: '重叠相消',
    categoryName: '图形推理空间思维',
    examWeight: '北森核心必考 (25%)',
    description: '两图叠加后相同线条抵消消除，保留不同线条；或公共特征提取简化。',
    keyFormulaOrTip: '第一步观察外框相似度，数各位置线条重合度，直接提取公共线条并相消（同消异存）。',
    baseAccuracy: 62,
    prerequisites: [],
    nextSteps: ['g_black_white_matrix'],
    subCategoryKeywords: [
      '重叠相消',
      '去同存异',
      '去异存同',
      '元素求同',
      '求同简化',
      '叠加相消',
      '叠加组合',
      '公共元素提取',
      '平面碎片平移拼合重构',
    ],
  },
  {
    id: 'g_step_rotation',
    category: 'graphic',
    name: '步长旋转与平移轨迹',
    shortName: '时针旋转',
    categoryName: '图形推理空间思维',
    examWeight: '高频必考 (20%)',
    description: '图形按固定步长（45°/90°/135°）顺时针/逆时针旋转或沿网格平移轨迹。',
    keyFormulaOrTip: '锁定图形上的一个尖角或特殊基准标记，只跟踪这一个特征点的运动轨迹。',
    baseAccuracy: 70,
    prerequisites: [],
    nextSteps: ['g_3d_spatial_folding'],
    subCategoryKeywords: [
      '旋转',
      '平移',
      '时针旋转',
      '位置移动',
      '顺时针90°旋转与轴翻转',
      '外框旋转与内点异向移动',
      '环形轨迹步进平移',
      '翻转',
    ],
  },
  {
    id: 'g_count_elements',
    category: 'graphic',
    name: '点线面角素数量规律',
    shortName: '数量规律',
    categoryName: '图形推理空间思维',
    examWeight: '高频 (18%)',
    description: '交点数（曲直交点/内外交点）、线条数、封闭面数、直角锐角数等差/等比。',
    keyFormulaOrTip: '线条乱乱数交点，图形封闭数白面，小黑点多看连线与位置，垂直折线数直角。',
    baseAccuracy: 66,
    prerequisites: [],
    nextSteps: ['g_open_close_topology'],
    subCategoryKeywords: [
      '数量关系',
      '直角数量递增',
      '封闭区域（面）数量递增',
      '曲直属性与线条数差值',
      '嵌套图形内外边数运算',
      '点线面角素之直曲交点',
      '一笔画与奇点规律',
      '元素等量代换',
      '阴影面积占比守恒',
      '汉字封闭空间与笔画',
      '元素遍历与位置组合',
      '数面',
      '数线',
      '数角',
      '数交点',
    ],
  },
  {
    id: 'g_black_white_matrix',
    category: 'graphic',
    name: '黑白格位运算与颜色矩阵',
    shortName: '黑白位运算',
    categoryName: '图形推理空间思维',
    examWeight: '北森特色 (18%)',
    description: '九宫格或十六宫格中黑白块叠加位运算：黑+白=白, 黑+黑=黑, 白+白=黑。',
    keyFormulaOrTip: '横向对比第一行与第二行提取黑白合成运算法则，代入第三行待求位置。',
    baseAccuracy: 59,
    prerequisites: ['g_overlay_subtraction'],
    nextSteps: [],
    subCategoryKeywords: ['黑白块运算法则', '九宫格黑白格位运算', '黑白位运算', '黑白格', '黑白矩阵'],
  },
  {
    id: 'g_symmetry_properties',
    category: 'graphic',
    name: '对称属性与曲直特征',
    shortName: '对称曲直',
    categoryName: '图形推理空间思维',
    examWeight: '常考 (10%)',
    description: '轴对称（对称轴方向及条数）、中心对称、纯直线图与纯曲线图。',
    keyFormulaOrTip: '画出对称轴方向（横/竖/斜45°），观察对称轴是否顺时针步进旋转。',
    baseAccuracy: 80,
    prerequisites: [],
    nextSteps: ['g_classification_group'],
    subCategoryKeywords: [
      '对称轴方向与数量',
      '对称轴角度步进旋转',
      '分类分组与中心对称',
      '分类分组与曲直特征',
      '对称性',
      '轴对称',
      '中心对称',
    ],
  },
  {
    id: 'g_open_close_topology',
    category: 'graphic',
    name: '开放封闭与连接相交',
    shortName: '拓扑连接',
    categoryName: '图形推理空间思维',
    examWeight: '技巧型 (8%)',
    description: '图形整体开放/封闭、点相接 vs 线相交、内含相切与包含关系。',
    keyFormulaOrTip: '关注图形接触方式：是点接触（相切）还是公共边重合相接。',
    baseAccuracy: 75,
    prerequisites: ['g_count_elements'],
    nextSteps: [],
    subCategoryKeywords: ['拓扑连接与相切点', '箭头指向与几何特征边', '点相接', '线相接', '连接方式'],
  },
  {
    id: 'g_3d_spatial_folding',
    category: 'graphic',
    name: '空间六面体折叠与立体截面',
    shortName: '空间折叠',
    categoryName: '图形推理空间思维',
    examWeight: '难点攻坚 (10%)',
    description: '正方体展开图相对面不相邻判定、相邻面特征点时针法检验、立体截面与俯视图。',
    keyFormulaOrTip: '相对面“同行隔一格”或“Z字两端”，在立体图中绝对不能同时出现！相邻面用时针法定向。',
    baseAccuracy: 56,
    prerequisites: ['g_step_rotation'],
    nextSteps: [],
    subCategoryKeywords: [
      '空间折叠与展开图',
      '空间三视图与投影',
      '立体空间截面图判定',
      '正方体展开图',
      '六面体折叠',
      '截面图',
      '三视图',
      '俯视图',
    ],
  },
  {
    id: 'g_classification_group',
    category: 'graphic',
    name: '分类分组与求同抽象',
    shortName: '分类分组',
    categoryName: '图形推理空间思维',
    examWeight: '常考 (8%)',
    description: '给出6个图形分为两组（3+3），分别具有某种共同特征。',
    keyFormulaOrTip: '优先按对称性、封闭面奇偶性、一笔画与多笔画进行二分法归类。',
    baseAccuracy: 73,
    prerequisites: ['g_symmetry_properties'],
    nextSteps: [],
    subCategoryKeywords: ['分类分组', '分组题', '六图分类'],
  },
];

export const EXTRA_RELATIONS = [
  { source: 'd_growth_amount', target: 'd_proportion_analysis', type: 'prerequisite', label: '速算赋能' },
  { source: 'd_base_current', target: 'd_mixed_growth', type: 'prerequisite', label: '基期支撑' },
  { source: 'g_overlay_subtraction', target: 'g_black_white_matrix', type: 'prerequisite', label: '相消同构' },
  { source: 'g_step_rotation', target: 'g_3d_spatial_folding', type: 'prerequisite', label: '旋转支撑' },
  { source: 'v_logic_fill', target: 'v_main_idea', type: 'prerequisite', label: '语境铺垫' },
  { source: 'd_chart_reading', target: 'v_detail_verify', type: 'cross_domain', label: '细节敏锐度迁移' },
  { source: 'g_count_elements', target: 'd_growth_rate', type: 'cross_domain', label: '定量思维协同' },
];

/**
 * Maps any given question to its primary taxonomy knowledge point node.
 */
export function findKnowledgePointForQuestion(q: Question): TaxonomyKnowledgePoint {
  const categoryPool = RAW_KNOWLEDGE_POINTS.filter((item) => item.category === q.category);

  // 1. Exact match on subCategory keywords
  if (q.subCategory) {
    for (const point of categoryPool) {
      if (
        point.subCategoryKeywords.some(
          (kw) => q.subCategory.includes(kw) || kw.includes(q.subCategory)
        )
      ) {
        return point;
      }
    }
  }

  // 2. Stem / explanation text matching (e.g. 图形题规律关键词)
  {
    const textToCheck = `${q.stem || ''}`;
    for (const point of categoryPool) {
      if (
        point.subCategoryKeywords.some((kw) => kw.length >= 3 && textToCheck.includes(kw)) ||
        textToCheck.includes(point.shortName)
      ) {
        return point;
      }
    }
  }

  // 3. Fallback to first in category
  return categoryPool[0] || RAW_KNOWLEDGE_POINTS[0];
}

// ===== 基于真实练习记录的考点统计（题库与作答数据驱动） =====
import { UserAnswerRecord, StudyStats } from '../types';

export interface PointStudyStats {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  mistakesCount: number;
  /** 做过至少一题时的正确率；null 表示尚未练习 */
  accuracy: number | null;
  status: 'mastered' | 'moderate' | 'weak' | 'unpracticed';
}

/** 考点在当前题库中对应的真实题目集合 */
export function questionsForPoint(point: TaxonomyKnowledgePoint, allQuestions: Question[]): Question[] {
  return allQuestions.filter(
    (q) =>
      q.category === point.category &&
      (q.subCategory?.includes(point.shortName) ||
        point.name.includes(q.subCategory || '') ||
        point.subCategoryKeywords.some((kw) => q.subCategory?.includes(kw)))
  );
}

/** 由题库 + 用户作答记录计算考点掌握情况（无作答时不虚构数据） */
export function computePointStats(
  point: TaxonomyKnowledgePoint,
  allQuestions: Question[],
  answerRecords: UserAnswerRecord[],
  stats?: StudyStats
): PointStudyStats {
  const ids = new Set(questionsForPoint(point, allQuestions).map((q) => q.id));
  const records = answerRecords.filter((r) => ids.has(r.questionId));
  const attemptedCount = records.length;
  const correctCount = records.filter((r) => r.isCorrect).length;
  const mistakesCount = stats?.mistakeIds.filter((id) => ids.has(id)).length || 0;

  if (attemptedCount === 0) {
    return {
      totalQuestions: ids.size,
      attemptedCount: 0,
      correctCount: 0,
      mistakesCount,
      accuracy: null,
      status: 'unpracticed',
    };
  }
  const accuracy = Math.round((correctCount / attemptedCount) * 100);
  return {
    totalQuestions: ids.size,
    attemptedCount,
    correctCount,
    mistakesCount,
    accuracy,
    status: accuracy >= 80 ? 'mastered' : accuracy >= 65 ? 'moderate' : 'weak',
  };
}
