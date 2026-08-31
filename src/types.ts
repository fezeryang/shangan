type QuestionCategory = 'verbal' | 'data' | 'graphic';

type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface OptionItem {
  key: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  content: string;
  graphicSvg?: string; // Optional SVG string for graphic options
}

export interface GraphicStemElement {
  id?: string;
  label?: string; // e.g. "图一", "图二", "图三", "?"
  svgCode?: string;
  gridCells?: string[]; // for 3x3 or 4x4 matrix
  description?: string;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  categoryName: string; // '言语理解与推理' | '资料分析与计算' | '图形推理空间思维'
  subCategory: string; // e.g. '主旨概括' | '意图判断' | '逻辑填空' | '增长率计算' | '比重分析' | '重叠相消' | '旋转平移' | '数量规律' | '空间属性'
  difficulty: QuestionDifficulty;
  stem: string;

  // Data Analysis Specific
  dataChartType?: 'bar' | 'line' | 'table' | 'pie' | 'composed';
  chartTitle?: string;
  chartData?: any[];
  chartColumns?: { key: string; label: string; unit?: string }[];

  // Graphic Reasoning Specific
  graphicType?: 'analogy' | 'series' | 'matrix3x3' | 'classify' | 'odd_one_out' | 'paper_fold';
  graphicElements?: GraphicStemElement[];
  patternRule?: string; // e.g. "去同存异 / 重叠相消", "顺时针旋转90°", "黑白运算: 黑+黑=白, 白+黑=黑"
  patternDimension?: '位置变化' | '叠加组合' | '数量关系' | '属性特征' | '空间折叠' | string;

  options: OptionItem[];
  correctAnswer: string;
  explanation: string;
  skillTip?: string;
}

export interface UserAnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSec: number;
  answeredAt: string;
}

interface CategoryStatItem {
  total: number;
  correct: number;
  timeSpentSec: number;
}

export interface StudyStats {
  totalAnswered: number;
  totalCorrect: number;
  streakDays: number;
  categoryStats: {
    verbal: CategoryStatItem;
    data: CategoryStatItem;
    graphic: CategoryStatItem;
    [key: string]: CategoryStatItem;
  };
  mistakeIds: string[];
}

export type ActiveTab = 'practice' | 'graphic-lab' | 'exam' | 'mistakes' | 'analytics' | 'cheatsheet';
