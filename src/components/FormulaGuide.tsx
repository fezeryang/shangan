import React, { useState } from 'react';
import { formulaBank } from '../data/formulaBank';
import {
  Award,
  Search,
  BookOpen,
  Shapes,
  BarChart3,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

export const FormulaGuide: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<'all' | 'data' | 'graphic' | 'verbal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Calculator Tool States
  const [calcXianQi, setCalcXianQi] = useState<string>('52850');
  const [calcGrowth, setCalcGrowth] = useState<string>('5.4');
  const [calcA, setCalcA] = useState<string>('12.5'); // 部分增速
  const [calcB, setCalcB] = useState<string>('8.2'); // 总体增速

  // Base Period & Growth Calc
  const numXianQi = parseFloat(calcXianQi) || 0;
  const numGrowth = parseFloat(calcGrowth) || 0;
  const rDecimal = numGrowth / 100;
  const basePeriod = rDecimal !== -1 ? (numXianQi / (1 + rDecimal)).toFixed(2) : '0';
  const growthAmount = rDecimal !== -1 ? ((numXianQi * rDecimal) / (1 + rDecimal)).toFixed(2) : '0';

  // Two-period proportion difference
  const numA = parseFloat(calcA) || 0;
  const numB = parseFloat(calcB) || 0;
  const proportionTrend = numA > numB ? '上升 ↑' : numA < numB ? '下降 ↓' : '持平 ＝';
  const maxDiff = Math.abs(numA - numB).toFixed(2);

  const filteredFormulas = formulaBank.filter((f) => {
    const matchCat = selectedCat === 'all' || f.category === selectedCat;
    const matchSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.mindShortcut.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e3d9c4] shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#fef7ea] rounded-xl border border-[#ebdcb9] text-[#b45309]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#26201a]">
              北森测评高频考点与速算公式宝典
            </h2>
            <p className="text-xs sm:text-sm text-[#786c5e]">
              资料分析秒杀模型 · 图形推理考点口诀 · 言语理解逻辑抓手
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Quick Calculators Box */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#eadecb]">
          <Zap className="w-5 h-5 text-[#b45309]" />
          <h3 className="font-bold text-[#26201a] text-sm sm:text-base">
            资料分析必考模型 · 即时速算演算器
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. 基期量与增长量计算 */}
          <div className="p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2] space-y-3">
            <div className="text-xs font-bold text-[#4a3e31] flex items-center justify-between">
              <span>① 基期量 & 增长量计算</span>
              <span className="text-[10px] text-[#786c5e] font-mono">基期=现期/(1+r)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#6e6153] mb-1">现期量 (万元/件/人):</label>
                <input
                  type="number"
                  value={calcXianQi}
                  onChange={(e) => setCalcXianQi(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#fffdfa] border border-[#ded3bd] rounded-lg text-[#26201a] font-mono"
                />
              </div>
              <div>
                <label className="block text-[#6e6153] mb-1">增长率 r (%):</label>
                <input
                  type="number"
                  value={calcGrowth}
                  onChange={(e) => setCalcGrowth(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#fffdfa] border border-[#ded3bd] rounded-lg text-[#26201a] font-mono"
                />
              </div>
            </div>
            <div className="p-3 bg-[#edf7ee] rounded-lg border border-[#bbf7d0] text-xs flex justify-between items-center">
              <div>
                <span className="text-[#15803d] font-medium">基期量: </span>
                <strong className="text-[#14532d] font-mono text-sm">{basePeriod}</strong>
              </div>
              <div>
                <span className="text-[#15803d] font-medium">增长量: </span>
                <strong className="text-[#14532d] font-mono text-sm">{growthAmount}</strong>
              </div>
            </div>
          </div>

          {/* 2. 两期比重升降判定 */}
          <div className="p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2] space-y-3">
            <div className="text-xs font-bold text-[#4a3e31] flex items-center justify-between">
              <span>② 两期比重升降与极值判定</span>
              <span className="text-[10px] text-[#786c5e] font-mono">a &gt; b 则上升</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#6e6153] mb-1">部分量增速 a (%):</label>
                <input
                  type="number"
                  value={calcA}
                  onChange={(e) => setCalcA(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#fffdfa] border border-[#ded3bd] rounded-lg text-[#26201a] font-mono"
                />
              </div>
              <div>
                <label className="block text-[#6e6153] mb-1">总体量增速 b (%):</label>
                <input
                  type="number"
                  value={calcB}
                  onChange={(e) => setCalcB(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#fffdfa] border border-[#ded3bd] rounded-lg text-[#26201a] font-mono"
                />
              </div>
            </div>
            <div className="p-3 bg-[#fef7ea] rounded-lg border border-[#ebdcb9] text-xs flex justify-between items-center">
              <div>
                <span className="text-[#854d0e] font-medium">比重变化趋势: </span>
                <strong className="text-[#78350f] font-bold text-sm">{proportionTrend}</strong>
              </div>
              <div>
                <span className="text-[#854d0e] font-medium">差值上限: </span>
                <strong className="text-[#78350f] font-mono text-sm">&lt; {maxDiff} 个百分点</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: '全部公式考点', icon: BookOpen },
            { id: 'data', label: '资料分析', icon: BarChart3 },
            { id: 'graphic', label: '图形推理', icon: Shapes },
            { id: 'verbal', label: '言语推理', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCat === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCat(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#b45309] text-white shadow-2xs'
                    : 'bg-[#fdfbf7] border border-[#e3d9c4] text-[#6e6153] hover:bg-[#f6eee0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#968877] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索考点、公式、百化分、口诀..."
            className="pl-9 pr-4 py-2 bg-[#fdfbf7] border border-[#e3d9c4] rounded-xl text-xs w-full sm:w-64 focus:outline-[#b45309] text-[#26201a]"
          />
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-[#fdfbf7] rounded-2xl p-5 border border-[#e3d9c4] shadow-2xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${
                      item.category === 'data'
                        ? 'bg-[#fff4ea] text-[#9a3412] border-[#f4d7b8]'
                        : item.category === 'graphic'
                        ? 'bg-[#f5ede3] text-[#6b3b1f] border-[#decfbe]'
                        : 'bg-[#fcf5e5] text-[#854d0e] border-[#ebdcb9]'
                    }`}
                  >
                    {item.categoryName}
                  </span>

                  <button
                    onClick={() => handleCopy(`${item.title}\n${item.formula}\n${item.mindShortcut}`, item.id)}
                    className="text-[#8c7e6d] hover:text-[#26201a] p-1 rounded hover:bg-[#f6eee0] transition-colors"
                    title="复制口诀与公式"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-[#15803d]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <h4 className="font-bold text-[#26201a] text-sm sm:text-base">{item.title}</h4>

                {/* Formula Highlight */}
                <div className="p-2.5 bg-[#f6efe2] text-[#9a3412] border border-[#eadecb] rounded-xl font-mono text-xs font-semibold overflow-x-auto whitespace-pre-wrap">
                  {item.formula}
                </div>

                <p className="text-xs text-[#5c4e3f] leading-relaxed">{item.description}</p>

                {/* Mind Shortcut */}
                <div className="p-2.5 bg-[#fef7ea] border border-[#ebdcb9] rounded-lg text-[#78350f] text-xs">
                  <span className="font-bold text-[#92400e]">⚡ 秒杀口诀：</span>
                  <div className="mt-0.5 leading-relaxed">{item.mindShortcut}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="pt-2 border-t border-[#ede4d2] flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 bg-[#f8f3e8] text-[#786c5e] border border-[#e8ded0] rounded-md font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
