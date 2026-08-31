import { Question } from '../types';
import { verbalQuestions } from './verbalQuestions';
import { dataAnalysisQuestions } from './dataAnalysisQuestions';
import { graphicQuestions } from './graphicQuestions';

export const allQuestions: Question[] = [
  ...verbalQuestions,
  ...dataAnalysisQuestions,
  ...graphicQuestions,
];

export const questionsById: Record<string, Question> = allQuestions.reduce((acc, q) => {
  acc[q.id] = q;
  return acc;
}, {} as Record<string, Question>);

export const categoryMeta = {
  verbal: {
    name: '言语理解与推理',
    shortName: '言语推理',
    count: verbalQuestions.length,
    description: '主旨概括、细节推断、选词填空、成语辨析、篇章阅读与逻辑链条',
    color: 'indigo',
    icon: 'BookOpen',
    bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  data: {
    name: '资料分析与计算',
    shortName: '资料分析',
    count: dataAnalysisQuestions.length,
    description: '柱折饼复式统计图表、同比增长率、基期现期量、两期比重、速算估算',
    color: 'emerald',
    icon: 'BarChart3',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  graphic: {
    name: '图形推理空间思维',
    shortName: '图形推理',
    count: graphicQuestions.length,
    description: '复杂图推、重叠相消、顺逆旋转平移、黑白位运算、对称性、数量点线面角素',
    color: 'amber',
    icon: 'Shapes',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
};
