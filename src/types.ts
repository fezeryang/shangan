type QuestionCategory = 'verbal' | 'data' | 'graphic';

type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface OptionItem {
  key: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  content: string;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  categoryName: string; // '言语理解与推理' | '资料分析与计算' | '图形推理空间思维'
  subCategory: string; // e.g. '主旨概括' | '意图判断' | '逻辑填空' | '增长率计算' | '比重分析' | '重叠相消' | '旋转平移' | '数量规律' | '空间属性'
  difficulty: QuestionDifficulty;
  stem: string;
  stemImages?: string[]; // 题面配图（PDF 原题图表，存放于 /public/qbank/）

  options: OptionItem[];
  correctAnswer: string;
  explanation: string;
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
