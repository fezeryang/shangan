export type QuestionCategory = 'verbal' | 'data' | 'graphic';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | number;

export interface OptionItem {
  key: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  content: string;
  graphicSvg?: string; // Optional SVG string or diagram descriptor for graphic options
  graphicProps?: {
    type?: string;
    elements?: any[];
    svgCode?: string;
  };
}

export interface GraphicStemElement {
  id?: string;
  label?: string; // e.g. "图一", "图二", "图三", "?"
  type?: string; // 'matrix3x3' | 'series' | 'analogy' | 'odd_one_out' | 'svg_render'
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
  materialText?: string;
  tags?: string[];
  
  // Data Analysis Specific
  chartType?: 'bar' | 'line' | 'table' | 'pie' | 'composed';
  dataChartType?: 'bar' | 'line' | 'table' | 'pie' | 'composed';
  chartTitle?: string;
  chartData?: any[];
  tableData?: any[];
  chartColumns?: { key: string; label: string; unit?: string }[];
  tableColumns?: { key: string; label: string; unit?: string }[];
  
  // Graphic Reasoning Specific
  graphicType?: 'analogy' | 'series' | 'matrix3x3' | 'classify' | 'odd_one_out' | 'paper_fold';
  stemElements?: GraphicStemElement[];
  graphicElements?: GraphicStemElement[];
  patternRule?: string; // e.g. "去同存异 / 重叠相消", "顺时针旋转90°", "黑白运算: 黑+黑=白, 白+黑=黑"
  patternDimension?: '位置变化' | '叠加组合' | '数量关系' | '属性特征' | '空间折叠' | string;
  interactiveLabType?: 'overlay' | 'rotate' | 'matrix_calc' | 'count';
  interactiveConfig?: any;

  options: OptionItem[];
  correctAnswer: string;
  explanation: string;
  formula?: string;
  skillTip?: string;
  source?: string;
  pageNumber?: number;
  suggestedTime?: number; // in seconds
}

export interface UserAnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSec: number;
  answeredAt: string;
  note?: string;
  bookmarked?: boolean;
}

export interface CategoryStatItem {
  total: number;
  correct: number;
  timeSpentSec: number;
}

export interface StudyStats {
  totalAnswered: number;
  totalCorrect: number;
  streakDays: number;
  lastActiveDate: string;
  categoryStats: {
    verbal: CategoryStatItem;
    data: CategoryStatItem;
    graphic: CategoryStatItem;
    [key: string]: CategoryStatItem;
  };
  mistakeIds: string[];
  masteredIds: string[];
  averageTimeSec?: number;
}

export type ActiveTab = 'practice' | 'graphic-lab' | 'exam' | 'mistakes' | 'analytics' | 'cheatsheet';

export interface ExamState {
  isStarted: boolean;
  isFinished: boolean;
  timeLeft: number;
  totalTimeSpent: number;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  marked: string[];
}
