import React, { useState, useMemo } from 'react';
import { Question } from '../types';
import { allQuestions } from '../data/allQuestions';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Layers,
  RotateCw,
  Grid,
  Hash,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Bot,
  Loader2,
} from 'lucide-react';

type LabTab = 'overlay' | 'rotate' | 'bitwise' | 'count';

/** 每个实验台对应的真实题型子分类 */
const TAB_SUBCATEGORIES: Record<LabTab, string[]> = {
  overlay: ['重叠相消'],
  rotate: ['时针旋转', '位置移动'],
  bitwise: ['黑白位运算'],
  count: ['数量规律'],
};

const TAB_META: Record<LabTab, { title: string; sub: string; icon: React.ReactNode }> = {
  overlay: { title: '① 重叠相消', sub: '去同存异 / 叠加求同', icon: <Layers className="w-4 h-4" /> },
  rotate: { title: '② 旋转移动', sub: '步长旋转 / 平移翻转', icon: <RotateCw className="w-4 h-4" /> },
  bitwise: { title: '③ 黑白位运算', sub: '黑块相加规则推导', icon: <Grid className="w-4 h-4" /> },
  count: { title: '④ 数量规律', sub: '点线角面快速计数', icon: <Hash className="w-4 h-4" /> },
};

function pickQuestion(tab: LabTab, excludeId?: string): Question {
  let pool = allQuestions.filter(
    (q) => q.category === 'graphic' && TAB_SUBCATEGORIES[tab].includes(q.subCategory)
  );
  if (pool.length === 0) pool = allQuestions.filter((q) => q.category === 'graphic');
  const candidates = excludeId ? pool.filter((q) => q.id !== excludeId) : pool;
  const src = candidates.length ? candidates : pool;
  return src[Math.floor(Math.random() * src.length)];
}

/* ---------------- 真实真题实战卡：真实题面图 + 交互作答 + AI 规律透析 ---------------- */
const RealQuestionCard: React.FC<{ tab: LabTab }> = ({ tab }) => {
  const [question, setQuestion] = useState<Question>(() => pickQuestion(tab));
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const nextQuestion = () => {
    const next = pickQuestion(tab, question.id);
    setQuestion(next);
    setSelected(null);
    setRevealed(false);
    setAiAnalysis(null);
  };

  const handleAnswer = (key: string) => {
    if (revealed) return;
    setSelected(key);
    setRevealed(true);
  };

  const askAI = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/ai/graphic-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAiAnalysis(data.analysis || data.details || data.error || '未能生成规律透析');
    } catch (e: any) {
      setAiAnalysis(`AI 分析失败: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="bg-[#fdfbf7] rounded-2xl p-5 border border-[#b45309]/25 shadow-2xs space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#e8ded0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#b45309] text-white font-bold">真题实战</span>
            <span className="text-xs text-[#786c5e] font-medium">
              考点「{question.subCategory}」· 难度 {question.difficulty === 'easy' ? '基础' : question.difficulty === 'medium' ? '进阶' : '挑战'}
            </span>
          </div>
          <h4 className="font-bold text-[#26201a] text-sm sm:text-base mt-1.5">{question.stem}</h4>
        </div>
        <button
          onClick={nextQuestion}
          className="shrink-0 px-3 py-1.5 bg-[#f6efe2] hover:bg-[#ede3d3] text-[#4a3e31] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>换一题</span>
        </button>
      </div>

      {/* 真实题面图（PDF 原图） */}
      {question.stemImages && question.stemImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.stemImages.map((src, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#e3d9c4] p-2 shadow-xs flex items-center justify-center">
              <img
                src={src}
                alt={`题面图 ${i + 1}`}
                className="max-w-full max-h-[280px] object-contain select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* 选项：字母对应图中从上到下 */}
      <div className="space-y-2">
        <p className="text-xs text-[#8c7e6d]">选项按题面图中从上到下依次对应 A、B、C…，点击作答：</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {question.options.map((opt) => {
            const isSelected = selected === opt.key;
            const isCorrectOpt = question.correctAnswer === opt.key;
            let style =
              'bg-[#faf7f0] border-[#ded4bf] hover:border-[#b45309] hover:bg-[#f6efe2] text-[#26201a]';
            if (revealed) {
              if (isCorrectOpt) style = 'bg-[#edf6ee] border-[#4e9658] text-[#14532d] font-semibold';
              else if (isSelected) style = 'bg-[#fef2f0] border-[#c2410c] text-[#991b1b]';
              else style = 'bg-[#fcfaf5] border-[#e7dece] text-[#968877] opacity-60';
            } else if (isSelected) {
              style = 'bg-[#fef7eb] border-[#b45309] text-[#26201a] font-semibold ring-1 ring-[#b45309]';
            }
            return (
              <button
                key={opt.key}
                type="button"
                disabled={revealed}
                onClick={() => handleAnswer(opt.key)}
                className={`px-3 py-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${style}`}
              >
                <span className="w-6 h-6 rounded-full bg-[#f3ead7] flex items-center justify-center font-bold text-[#4a3e31] shrink-0">
                  {opt.key}
                </span>
                <span className="flex-1 text-left">{opt.content}</span>
                {revealed && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />}
                {revealed && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-[#b91c1c] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 判题反馈 + 官方解析 */}
      {revealed && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              isCorrect ? 'bg-[#edf7ee] text-[#14532d] border border-[#bbf7d0]' : 'bg-[#fef2f0] text-[#991b1b] border border-[#fecaca]'
            }`}
          >
            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-[#15803d]" /> : <XCircle className="w-4 h-4 text-[#b91c1c]" />}
            {isCorrect
              ? `回答正确！正确答案是 ${question.correctAnswer}`
              : `回答错误，正确答案是 ${question.correctAnswer}`}
          </div>

          <div className="bg-[#f8f3e8] p-4 rounded-xl border border-[#e3d8c2] text-xs leading-relaxed text-[#4a3e31]">
            <div className="font-bold text-[#26201a] mb-1.5">【官方解析】</div>
            <p className="whitespace-pre-wrap">{question.explanation || '本题暂无官方解析，可点击下方 AI 规律透析。'}</p>
          </div>

          <button
            onClick={askAI}
            disabled={aiLoading}
            className="w-full px-3 py-2.5 bg-[#2c241d] hover:bg-[#3d3124] disabled:opacity-60 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4 text-[#fed7aa]" />}
            <span>{aiLoading ? 'AI 规律透析生成中…' : '🔍 AI 规律透析（视觉解构 + 秒杀排除法）'}</span>
          </button>

          {aiAnalysis && (
            <div className="bg-[#fff8eb] p-4 rounded-xl border border-[#ebdcb9]">
              <div className="text-xs font-bold text-[#854d0e] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#b45309]" /> AI 规律透析
              </div>
              <MarkdownRenderer content={aiAnalysis} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PatternLab: React.FC = () => {
  const [labTab, setLabTab] = useState<LabTab>('overlay');

  /* ---------- 1. 重叠相消演示器 ---------- */
  const [shapeALines, setShapeALines] = useState<number[]>([1, 2, 4, 7]);
  const [shapeBLines, setShapeBLines] = useState<number[]>([2, 5, 7, 8]);
  const [overlayMode, setOverlayMode] = useState<'xor' | 'union' | 'intersect'>('xor');

  const lineDefinitions: Record<number, { x1: number; y1: number; x2: number; y2: number; label: string }> = {
    1: { x1: 10, y1: 10, x2: 90, y2: 10, label: '上边' },
    2: { x1: 10, y1: 90, x2: 90, y2: 90, label: '下边' },
    3: { x1: 10, y1: 10, x2: 10, y2: 90, label: '左边' },
    4: { x1: 90, y1: 10, x2: 90, y2: 90, label: '右边' },
    5: { x1: 10, y1: 10, x2: 90, y2: 90, label: '主对角线' },
    6: { x1: 90, y1: 10, x2: 10, y2: 90, label: '副对角线' },
    7: { x1: 10, y1: 50, x2: 90, y2: 50, label: '中横线' },
    8: { x1: 50, y1: 10, x2: 50, y2: 90, label: '中竖线' },
  };

  const toggleLineA = (id: number) =>
    setShapeALines((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleLineB = (id: number) =>
    setShapeBLines((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const getResultLines = () => {
    if (overlayMode === 'xor') {
      return Object.keys(lineDefinitions).map(Number).filter((id) => {
        const inA = shapeALines.includes(id);
        const inB = shapeBLines.includes(id);
        return (inA && !inB) || (!inA && inB);
      });
    }
    if (overlayMode === 'union') return Array.from(new Set([...shapeALines, ...shapeBLines]));
    return shapeALines.filter((id) => shapeBLines.includes(id));
  };

  /* ---------- 2. 旋转移动演示器 ---------- */
  const [rotAngle, setRotAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  /* ---------- 3. 黑白位运算演示器 ---------- */
  const [gridA, setGridA] = useState<boolean[]>([true, false, false, true]);
  const [gridB, setGridB] = useState<boolean[]>([true, true, false, false]);
  const [rules, setRules] = useState({ bb: true, bw: false, ww: true });

  const computeBitwiseResult = () =>
    [0, 1, 2, 3].map((i) => {
      const a = gridA[i];
      const b = gridB[i];
      if (a && b) return rules.bb;
      if (!a && !b) return rules.ww;
      return rules.bw;
    });

  /* ---------- 4. 数量规律演示器：正 n 边形点/线/对角线 ---------- */
  const [sides, setSides] = useState(5);
  const poly = useMemo(() => {
    const cx = 100;
    const cy = 100;
    const r = 78;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < sides; i++) {
      const ang = (Math.PI * 2 * i) / sides - Math.PI / 2;
      pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
    }
    const edges: [number, number][] = [];
    const diagonals: [number, number][] = [];
    for (let i = 0; i < sides; i++) {
      for (let j = i + 1; j < sides; j++) {
        const diff = Math.min(j - i, sides - (j - i));
        if (diff === 1) edges.push([i, j]);
        else diagonals.push([i, j]);
      }
    }
    return { pts, edges, diagonals };
  }, [sides]);
  const diagCount = (sides * (sides - 3)) / 2;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e3d9c4] shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef7ea] text-[#854d0e] text-xs font-semibold border border-[#ebdcb9] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
            <span>真实真题 + 动态推演 + AI 规律透析</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#26201a] mb-2">
            复杂图形推理 · 规律动态实验室
          </h2>
          <p className="text-xs sm:text-sm text-[#786c5e] leading-relaxed">
            每一类规律都直接使用题库中的 <strong className="text-[#26201a]">真实北森图形真题</strong> 实战演练，
            配合下方“规律演示器”把抽象规则可视化，再用 AI 做深度视觉解构与秒杀排除法拆解。
          </p>
        </div>
      </div>

      {/* Lab Nav Tabs */}
      <div className="flex border-b border-[#e3d9c4] bg-[#fdfbf7] rounded-xl p-1 shadow-2xs gap-1 overflow-x-auto no-scrollbar">
        {(Object.keys(TAB_META) as LabTab[]).map((key) => (
          <button
            key={key}
            onClick={() => setLabTab(key)}
            className={`flex-1 min-w-fit py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              labTab === key ? 'bg-[#b45309] text-white shadow-xs' : 'text-[#6e6153] hover:bg-[#f6eee0]'
            }`}
          >
            {TAB_META[key].icon}
            <span>{TAB_META[key].title}</span>
          </button>
        ))}
      </div>

      {/* 真实真题实战卡 */}
      <RealQuestionCard tab={labTab} />

      {/* ============ 模块1：重叠相消演示器 ============ */}
      {labTab === 'overlay' && (
        <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eadecb]">
            <div>
              <h3 className="font-bold text-[#26201a] text-base">规律演示器：重叠相消（去同存异）</h3>
              <p className="text-xs text-[#786c5e] mt-0.5">
                点击图形 A / B 的线条开关，观察右侧叠加结果；再回到上方真题验证同一规律
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#f6efe2] p-1 rounded-lg text-xs">
              <button
                onClick={() => setOverlayMode('xor')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  overlayMode === 'xor' ? 'bg-[#fffdfa] text-[#854d0e] font-bold shadow-2xs' : 'text-[#786c5e]'
                }`}
              >
                去同存异
              </button>
              <button
                onClick={() => setOverlayMode('union')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  overlayMode === 'union' ? 'bg-[#fffdfa] text-[#854d0e] font-bold shadow-2xs' : 'text-[#786c5e]'
                }`}
              >
                直接叠加
              </button>
              <button
                onClick={() => setOverlayMode('intersect')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  overlayMode === 'intersect' ? 'bg-[#fffdfa] text-[#854d0e] font-bold shadow-2xs' : 'text-[#786c5e]'
                }`}
              >
                求同保留
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {[
              { title: '图形 A', color: '#b45309', lines: shapeALines, toggle: toggleLineA, label: 'A' },
              { title: '图形 B', color: '#9a3412', lines: shapeBLines, toggle: toggleLineB, label: 'B' },
            ].map((shape) => (
              <div key={shape.label} className="md:col-span-2 flex flex-col items-center p-4 bg-[#fcf8ef] rounded-xl border border-[#ebdcb9]">
                <span className="text-xs font-bold text-[#854d0e] mb-2">图形 {shape.label}（点击线条开关）</span>
                <svg viewBox="0 0 100 100" className="w-40 h-40 bg-[#fffdfa] rounded-lg shadow-sm border border-[#ded2bd]">
                  <rect x="10" y="10" width="80" height="80" fill="none" stroke="#e8ded0" strokeDasharray="3,3" />
                  {Object.entries(lineDefinitions).map(([idStr, line]) => {
                    const id = Number(idStr);
                    const checked = shape.lines.includes(id);
                    return (
                      <g key={id} onClick={() => shape.toggle(id)} className="cursor-pointer group">
                        <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="transparent" strokeWidth="14" />
                        <line
                          x1={line.x1}
                          y1={line.y1}
                          x2={line.x2}
                          y2={line.y2}
                          stroke={checked ? shape.color : '#ded2bd'}
                          strokeWidth={checked ? '4' : '2'}
                          strokeLinecap="round"
                          className="transition-colors group-hover:stroke-[#d97706]"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            ))}

            <div className="flex flex-col items-center justify-center text-[#8c7e6d] font-bold text-xl">
              <span className="p-2 bg-[#f6efe2] rounded-full text-[#b45309] text-sm font-semibold">
                {overlayMode === 'xor' ? '⊕ 相消' : overlayMode === 'union' ? '＋ 叠加' : '∩ 求同'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center p-5 bg-[#edf7ee] rounded-xl border border-[#bbf7d0]">
            <span className="text-xs font-bold text-[#14532d] mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803d]" /> 运算结果图形
            </span>
            <svg viewBox="0 0 100 100" className="w-44 h-44 bg-[#fffdfa] rounded-xl shadow-md border-2 border-[#15803d]">
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="#e2f0e4" strokeDasharray="2,2" />
              {getResultLines().map((id) => {
                const line = lineDefinitions[id];
                return (
                  <line
                    key={id}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#15803d"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div className="mt-3 text-xs text-[#14532d] font-medium text-center">
              {overlayMode === 'xor' && '✨ 重合线段全部抵消，仅保留两图各自独有线条（真题最常见考法）。'}
              {overlayMode === 'union' && '✨ 所有出现过的线条直接合并。'}
              {overlayMode === 'intersect' && '✨ 仅显示两图共同重合的公共线段。'}
            </div>
          </div>
        </div>
      )}

      {/* ============ 模块2：旋转移动演示器 ============ */}
      {labTab === 'rotate' && (
        <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
          <div className="pb-3 border-b border-[#eadecb]">
            <h3 className="font-bold text-[#26201a] text-base">规律演示器：旋转步长与镜像翻转</h3>
            <p className="text-xs text-[#786c5e] mt-0.5">
              先在上方真题里观察“小黑点/箭头方向”，再用下方控制器验证 45° 步进旋转与镜像翻转
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-8 bg-[#f8f3e8] rounded-2xl border border-[#e3d8c2]">
              <div
                className="w-48 h-48 bg-[#fffdfa] rounded-xl shadow-md border-2 border-[#b45309] flex items-center justify-center transition-all duration-300"
                style={{
                  transform: `rotate(${rotAngle}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                }}
              >
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                  <polygon points="20,20 80,20 50,50 80,80 20,80" fill="#fef7ea" stroke="#b45309" strokeWidth="3" />
                  <circle cx="20" cy="20" r="8" fill="#26201a" />
                  <line x1="20" y1="20" x2="20" y2="80" stroke="#78350f" strokeWidth="4" />
                </svg>
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs font-mono text-[#4a3e31]">
                <span>旋转 <strong>{rotAngle}°</strong></span>
                <span>水平翻转 <strong>{flipH ? '开' : '关'}</strong></span>
                <span>垂直翻转 <strong>{flipV ? '开' : '关'}</strong></span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4a3e31] mb-2">快速旋转（45° 步进）：</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                    <button
                      key={ang}
                      onClick={() => setRotAngle(ang)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        rotAngle === ang ? 'bg-[#b45309] text-white shadow-xs' : 'bg-[#f6efe2] hover:bg-[#ede3d3] text-[#4a3e31]'
                      }`}
                    >
                      {ang}°
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setRotAngle((prev) => (prev + 45) % 360)}
                  className="flex-1 py-2.5 bg-[#fef7ea] hover:bg-[#faeed6] text-[#854d0e] border border-[#ebdcb9] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-[#b45309]" /> 顺时针 +45°
                </button>
                <button
                  onClick={() => setRotAngle((prev) => (prev + 90) % 360)}
                  className="flex-1 py-2.5 bg-[#fef7ea] hover:bg-[#faeed6] text-[#854d0e] border border-[#ebdcb9] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-[#b45309]" /> 顺时针 +90°
                </button>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setFlipH(!flipH)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    flipH ? 'bg-[#b45309] text-white' : 'bg-[#f6efe2] text-[#4a3e31] hover:bg-[#ede3d3]'
                  }`}
                >
                  左右镜像翻转
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    flipV ? 'bg-[#b45309] text-white' : 'bg-[#f6efe2] text-[#4a3e31] hover:bg-[#ede3d3]'
                  }`}
                >
                  上下镜像翻转
                </button>
                <button
                  onClick={() => {
                    setRotAngle(0);
                    setFlipH(false);
                    setFlipV(false);
                  }}
                  className="p-2 text-[#8c7e6d] hover:text-[#26201a] rounded-lg hover:bg-[#f6efe2]"
                  title="重置"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-[#fff8eb] rounded-xl border border-[#ebdcb9] text-xs text-[#78350f]">
                💡 <strong>秒杀技巧</strong>：旋转看关键特征拐角/小黑点；翻转看箭头开口与不对称元素的左右位置。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ 模块3：黑白位运算演示器 ============ */}
      {labTab === 'bitwise' && (
        <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
          <div className="pb-3 border-b border-[#eadecb]">
            <h3 className="font-bold text-[#26201a] text-base">规律演示器：黑白格位运算规则推导</h3>
            <p className="text-xs text-[#786c5e] mt-0.5">
              点击格子翻转黑白并配置运算法则；再回上方真题验证“黑+黑 / 黑+白 / 白+白”的位运算规律
            </p>
          </div>

          <div className="p-3 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2] flex flex-wrap items-center gap-4 text-xs font-medium text-[#4a3e31]">
            <span className="font-bold text-[#26201a]">当前运算法则：</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span>黑 + 黑 =</span>
              <select
                value={rules.bb ? 'black' : 'white'}
                onChange={(e) => setRules({ ...rules, bb: e.target.value === 'black' })}
                className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold"
              >
                <option value="black">黑</option>
                <option value="white">白</option>
              </select>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span>黑 + 白 =</span>
              <select
                value={rules.bw ? 'black' : 'white'}
                onChange={(e) => setRules({ ...rules, bw: e.target.value === 'black' })}
                className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold"
              >
                <option value="white">白</option>
                <option value="black">黑</option>
              </select>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span>白 + 白 =</span>
              <select
                value={rules.ww ? 'black' : 'white'}
                onChange={(e) => setRules({ ...rules, ww: e.target.value === 'black' })}
                className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold"
              >
                <option value="black">黑</option>
                <option value="white">白</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {[
              { label: '图形 A', grid: gridA, setGrid: setGridA },
              { label: '图形 B', grid: gridB, setGrid: setGridB },
            ].map((g) => (
              <div key={g.label} className="md:col-span-2 flex flex-col items-center p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2]">
                <span className="text-xs font-bold text-[#4a3e31] mb-2">{g.label}（点击翻转黑白）</span>
                <div className="grid grid-cols-2 gap-1 w-32 h-32 p-1 bg-[#fffdfa] border border-[#ded3bd] rounded-lg">
                  {g.grid.map((isBlack, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const copy = [...g.grid];
                        copy[i] = !copy[i];
                        g.setGrid(copy);
                      }}
                      className={`rounded transition-colors cursor-pointer border ${
                        isBlack ? 'bg-[#26201a] border-[#26201a]' : 'bg-[#fffdfa] border-[#ded3bd] hover:bg-[#f6eee0]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center text-xl font-bold text-[#8c7e6d]">＋</div>
          </div>

          <div className="flex flex-col items-center p-5 bg-[#fef7ea] rounded-xl border border-[#ebdcb9]">
            <span className="text-xs font-bold text-[#854d0e] mb-2">运算结果</span>
            <div className="grid grid-cols-2 gap-1 w-32 h-32 p-1 bg-[#fffdfa] border-2 border-[#b45309] rounded-lg shadow-sm">
              {computeBitwiseResult().map((isBlack, i) => (
                <div key={i} className={`rounded ${isBlack ? 'bg-[#26201a]' : 'bg-[#fffdfa] border border-[#ded3bd]'}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ 模块4：数量规律演示器 ============ */}
      {labTab === 'count' && (
        <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
          <div className="pb-3 border-b border-[#eadecb]">
            <h3 className="font-bold text-[#26201a] text-base">规律演示器：点 / 线 / 对角线实时计数</h3>
            <p className="text-xs text-[#786c5e] mt-0.5">
              拖动滑块改变正多边形边数，观察顶点、边、对角线数量的递变公式；再回上方真题练习数点/数线/数面
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center p-6 bg-[#f8f3e8] rounded-2xl border border-[#e3d8c2]">
              <svg viewBox="0 0 200 200" className="w-56 h-56 bg-[#fffdfa] rounded-xl border border-[#ded3bd] shadow-sm">
                {poly.diagonals.map(([a, b], i) => (
                  <line
                    key={`d${i}`}
                    x1={poly.pts[a].x}
                    y1={poly.pts[a].y}
                    x2={poly.pts[b].x}
                    y2={poly.pts[b].y}
                    stroke="#f4b8a0"
                    strokeWidth="1.6"
                  />
                ))}
                {poly.edges.map(([a, b], i) => (
                  <line
                    key={`e${i}`}
                    x1={poly.pts[a].x}
                    y1={poly.pts[a].y}
                    x2={poly.pts[b].x}
                    y2={poly.pts[b].y}
                    stroke="#b45309"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                ))}
                {poly.pts.map((p, i) => (
                  <circle key={`p${i}`} cx={p.x} cy={p.y} r="5" fill="#26201a" />
                ))}
              </svg>
              <div className="mt-3 flex items-center gap-3 text-xs font-mono text-[#4a3e31]">
                <span>边数 n = <strong>{sides}</strong></span>
                <input
                  type="range"
                  min={3}
                  max={8}
                  value={sides}
                  onChange={(e) => setSides(Number(e.target.value))}
                  className="accent-[#b45309] w-40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-4 bg-[#fffdfa] rounded-xl border border-[#ded3bd]">
                <div className="text-[10px] text-[#8c7e6d]">顶点（点）</div>
                <div className="text-2xl font-extrabold text-[#26201a] font-display mt-1">{sides}</div>
              </div>
              <div className="p-4 bg-[#fffdfa] rounded-xl border border-[#ded3bd]">
                <div className="text-[10px] text-[#8c7e6d]">边（线）</div>
                <div className="text-2xl font-extrabold text-[#26201a] font-display mt-1">{sides}</div>
              </div>
              <div className="p-4 bg-[#fef7ea] rounded-xl border border-[#ebdcb9]">
                <div className="text-[10px] text-[#854d0e]">对角线</div>
                <div className="text-2xl font-extrabold text-[#b45309] font-display mt-1">{diagCount}</div>
              </div>
              <div className="p-4 bg-[#fef7ea] rounded-xl border border-[#ebdcb9]">
                <div className="text-[10px] text-[#854d0e]">总线段</div>
                <div className="text-2xl font-extrabold text-[#b45309] font-display mt-1">{sides + diagCount}</div>
              </div>
              <div className="col-span-2 p-3 bg-[#fff8eb] rounded-xl border border-[#ebdcb9] text-[11px] text-[#78350f] leading-relaxed text-left">
                💡 对角线公式 <strong>n(n-3)/2</strong>；真题“数量规律”常考顶点数、边数、交点数、封闭面数，先数局部特殊元素再找递变步长。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
