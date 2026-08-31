import { Question } from '../types';
import { verbalQuestions } from './verbalQuestions';
import { dataAnalysisQuestions } from './dataAnalysisQuestions';
import { graphicQuestions } from './graphicQuestions';

export const allQuestions: Question[] = [
  ...verbalQuestions,
  ...dataAnalysisQuestions,
  ...graphicQuestions,
];

export const categoryMeta = {
  verbal: {
    name: '言语理解与推理',
    shortName: '言语推理',
    count: verbalQuestions.length,
  },
  data: {
    name: '资料分析与计算',
    shortName: '资料分析',
    count: dataAnalysisQuestions.length,
  },
  graphic: {
    name: '图形推理空间思维',
    shortName: '图形推理',
    count: graphicQuestions.length,
  },
};
