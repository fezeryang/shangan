import React, { useState } from 'react';
import {
  Layers,
  RotateCw,
  Grid,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const PatternLab: React.FC = () => {
  const [labTab, setLabTab] = useState<'overlay' | 'rotate' | 'bitwise'>('overlay');

  // 1. Overlay Lab State (3x3 grid line segments)
  const [shapeALines, setShapeALines] = useState<number[]>([1, 2, 4, 7]);
  const [shapeBLines, setShapeBLines] = useState<number[]>([2, 5, 7, 8]);
  const [overlayMode, setOverlayMode] = useState<'xor' | 'union' | 'intersect'>('xor');

  // Available lines in a box with diagonals & cross:
  // 1: top, 2: bottom, 3: left, 4: right, 5: diagTL-BR, 6: diagTR-BL, 7: midH, 8: midV
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

  const toggleLineA = (id: number) => {
    setShapeALines((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleLineB = (id: number) => {
    setShapeBLines((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Compute result lines based on mode
  const getResultLines = () => {
    if (overlayMode === 'xor') {
      // 去同存异（重叠相消）
      return Object.keys(lineDefinitions).map(Number).filter((id) => {
        const inA = shapeALines.includes(id);
        const inB = shapeBLines.includes(id);
        return (inA && !inB) || (!inA && inB);
      });
    } else if (overlayMode === 'union') {
      // 简单叠加（求全集）
      return Array.from(new Set([...shapeALines, ...shapeBLines]));
    } else {
      // 去异存同（求交集）
      return shapeALines.filter((id) => shapeBLines.includes(id));
    }
  };

  // 2. Rotation Lab State
  const [rotAngle, setRotAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // 3. Bitwise Black/White Grid State (2x2)
  const [gridA, setGridA] = useState<boolean[]>([true, false, false, true]);
  const [gridB, setGridB] = useState<boolean[]>([true, true, false, false]);
  const [rules, setRules] = useState({
    bb: true, // 黑+黑 = 黑
    bw: false, // 黑+白 = 白
    ww: true, // 白+白 = 黑
  });

  const computeBitwiseResult = () => {
    return [0, 1, 2, 3].map((i) => {
      const isBlackA = gridA[i];
      const isBlackB = gridB[i];
      if (isBlackA && isBlackB) return rules.bb;
      if (!isBlackA && !isBlackB) return rules.ww;
      return rules.bw;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e3d9c4] shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef7ea] text-[#854d0e] text-xs font-semibold border border-[#ebdcb9] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
            <span>核心难点专项突破</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#26201a] mb-2">
            复杂图形推理 · 规律动态实验室
          </h2>
          <p className="text-xs sm:text-sm text-[#786c5e] leading-relaxed">
            告别死记硬背！通过可视化交互模拟器，直观操作“重叠相消”、“时针旋转”、“黑白位运算”，彻底洞悉大厂图推命题规律。
          </p>
        </div>
      </div>

      {/* Lab Nav Tabs */}
      <div className="flex border-b border-[#e3d9c4] bg-[#fdfbf7] rounded-xl p-1 shadow-2xs gap-1">
        <button
          onClick={() => setLabTab('overlay')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            labTab === 'overlay'
              ? 'bg-[#b45309] text-white shadow-xs'
              : 'text-[#6e6153] hover:bg-[#f6eee0]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>① 重叠相消/求同存异 演练台</span>
        </button>

        <button
          onClick={() => setLabTab('rotate')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            labTab === 'rotate'
              ? 'bg-[#b45309] text-white shadow-xs'
              : 'text-[#6e6153] hover:bg-[#f6eee0]'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>② 步长旋转与对称翻转 模拟器</span>
        </button>

        <button
          onClick={() => setLabTab('bitwise')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            labTab === 'bitwise'
              ? 'bg-[#b45309] text-white shadow-xs'
              : 'text-[#6e6153] hover:bg-[#f6eee0]'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>③ 黑白格运算规则推导器</span>
        </button>
      </div>

      {/* MODULE 1: OVERLAY / XOR SIMULATOR */}
      {labTab === 'overlay' && (
        <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eadecb]">
            <div>
              <h3 className="font-bold text-[#26201a] text-base">重叠相消（求同存异）实时动态模拟</h3>
              <p className="text-xs text-[#786c5e] mt-0.5">
                点击图形A和图形B中的线条进行添加/移除，观察右侧自动计算的叠加结果
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#f6efe2] p-1 rounded-lg text-xs">
              <button
                onClick={() => setOverlayMode('xor')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  overlayMode === 'xor' ? 'bg-[#fffdfa] text-[#854d0e] font-bold shadow-2xs' : 'text-[#786c5e]'
                }`}
              >
                去同存异 (重叠相消)
              </button>
              <button
                onClick={() => setOverlayMode('union')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  overlayMode === 'union' ? 'bg-[#fffdfa] text-[#854d0e] font-bold shadow-2xs' : 'text-[#786c5e]'
                }`}
              >
                直接相加 (求并集)
              </button>
              <button
                onClick={() => setOverlayMode('intersect')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  overlayMode === 'intersect' ? 'bg-[#fffdfa] text-[#854d0e] font-bold shadow-2xs' : 'text-[#786c5e]'
                }`}
              >
                去异存同 (求交集)
              </button>
            </div>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Shape A */}
            <div className="md:col-span-2 flex flex-col items-center p-4 bg-[#fcf8ef] rounded-xl border border-[#ebdcb9]">
              <span className="text-xs font-bold text-[#854d0e] mb-2">图形 A (点击线条开关)</span>
              <svg viewBox="0 0 100 100" className="w-40 h-40 bg-[#fffdfa] rounded-lg shadow-sm border border-[#ded2bd]">
                <rect x="10" y="10" width="80" height="80" fill="none" stroke="#e8ded0" strokeDasharray="3,3" />
                {Object.entries(lineDefinitions).map(([idStr, line]) => {
                  const id = Number(idStr);
                  const isChecked = shapeALines.includes(id);
                  return (
                    <g key={id} onClick={() => toggleLineA(id)} className="cursor-pointer group">
                      <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="transparent" strokeWidth="14" />
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke={isChecked ? '#b45309' : '#ded2bd'}
                        strokeWidth={isChecked ? '4' : '2'}
                        strokeLinecap="round"
                        className="transition-colors group-hover:stroke-[#d97706]"
                      />
                    </g>
                  );
                })}
              </svg>
              <span className="text-[11px] text-[#786c5e] mt-2">已选 {shapeALines.length} 条线段</span>
            </div>

            {/* Math Operator Indicator */}
            <div className="flex flex-col items-center justify-center text-[#8c7e6d] font-bold text-xl">
              <span className="p-2 bg-[#f6efe2] rounded-full text-[#b45309] text-sm font-semibold">
                {overlayMode === 'xor' ? '⊕ 相消' : overlayMode === 'union' ? '＋ 叠加' : '∩ 求同'}
              </span>
            </div>

            {/* Shape B */}
            <div className="md:col-span-2 flex flex-col items-center p-4 bg-[#f8f3e8] rounded-xl border border-[#ded2bd]">
              <span className="text-xs font-bold text-[#6b3b1f] mb-2">图形 B (点击线条开关)</span>
              <svg viewBox="0 0 100 100" className="w-40 h-40 bg-[#fffdfa] rounded-lg shadow-sm border border-[#ded2bd]">
                <rect x="10" y="10" width="80" height="80" fill="none" stroke="#e8ded0" strokeDasharray="3,3" />
                {Object.entries(lineDefinitions).map(([idStr, line]) => {
                  const id = Number(idStr);
                  const isChecked = shapeBLines.includes(id);
                  return (
                    <g key={id} onClick={() => toggleLineB(id)} className="cursor-pointer group">
                      <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="transparent" strokeWidth="14" />
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke={isChecked ? '#9a3412' : '#ded2bd'}
                        strokeWidth={isChecked ? '4' : '2'}
                        strokeLinecap="round"
                        className="transition-colors group-hover:stroke-[#c2410c]"
                      />
                    </g>
                  );
                })}
              </svg>
              <span className="text-[11px] text-[#786c5e] mt-2">已选 {shapeBLines.length} 条线段</span>
            </div>
          </div>

          {/* Equal Sign & Output Canvas */}
          <div className="flex flex-col items-center p-5 bg-[#edf7ee] rounded-xl border border-[#bbf7d0]">
            <span className="text-xs font-bold text-[#14532d] mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
              <span>运算结果图形（最终呈现）</span>
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
              {overlayMode === 'xor' && '✨ 重合的线段全部抵消消隐，保留两图各自独有的线条！'}
              {overlayMode === 'union' && '✨ 全部出现过的线条直接合并显示！'}
              {overlayMode === 'intersect' && '✨ 仅显示两图共同重合的公共线段！'}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: ROTATION & SYMMETRY LAB */}
      {labTab === 'rotate' && (
        <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
          <div className="pb-3 border-b border-[#eadecb]">
            <h3 className="font-bold text-[#26201a] text-base">旋转与翻转动态轨迹追踪</h3>
            <p className="text-xs text-[#786c5e] mt-0.5">
              测试 45°、90°、180° 旋转角度以及水平/垂直镜像对图形特征的影响
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Canvas */}
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
                <span>当前旋转: <strong>{rotAngle}°</strong></span>
                <span>水平翻转: <strong>{flipH ? '开启' : '关闭'}</strong></span>
                <span>垂直翻转: <strong>{flipV ? '开启' : '关闭'}</strong></span>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4a3e31] mb-2">
                  快速顺时针旋转：
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                    <button
                      key={ang}
                      onClick={() => setRotAngle(ang)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        rotAngle === ang
                          ? 'bg-[#b45309] text-white shadow-xs'
                          : 'bg-[#f6efe2] hover:bg-[#ede3d3] text-[#4a3e31]'
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
                  <RotateCw className="w-4 h-4 text-[#b45309]" />
                  <span>顺时针 +45°</span>
                </button>

                <button
                  onClick={() => setRotAngle((prev) => (prev + 90) % 360)}
                  className="flex-1 py-2.5 bg-[#fef7ea] hover:bg-[#faeed6] text-[#854d0e] border border-[#ebdcb9] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-[#b45309]" />
                  <span>顺时针 +90°</span>
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
                💡 <strong>秒杀技巧</strong>：旋转看关键特征拐角/小黑点；翻转看左右对称与不对称箭头开口方向。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: BITWISE BLACK/WHITE MATRIX */}
      {labTab === 'bitwise' && (
        <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e3d9c4] shadow-xs space-y-6">
          <div className="pb-3 border-b border-[#eadecb]">
            <h3 className="font-bold text-[#26201a] text-base">黑白格逻辑位运算规则定制与推导</h3>
            <p className="text-xs text-[#786c5e] mt-0.5">
              点击方格切换黑白，配置运算规则，自动生成运算结果
            </p>
          </div>

          {/* Rule Settings */}
          <div className="p-3 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2] flex flex-wrap items-center gap-4 text-xs font-medium text-[#4a3e31]">
            <span className="font-bold text-[#26201a]">当前黑白运算法则配置：</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span>黑 + 黑 =</span>
              <select
                value={rules.bb ? 'black' : 'white'}
                onChange={(e) => setRules({ ...rules, bb: e.target.value === 'black' })}
                className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold text-[#26201a]"
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
                className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold text-[#26201a]"
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
                className="bg-[#fffdfa] border border-[#ded3bd] rounded px-1.5 py-0.5 font-bold text-[#26201a]"
              >
                <option value="black">黑</option>
                <option value="white">白</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Grid A */}
            <div className="md:col-span-2 flex flex-col items-center p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2]">
              <span className="text-xs font-bold text-[#4a3e31] mb-2">图形 A (点击格子翻转黑白)</span>
              <div className="grid grid-cols-2 gap-1 w-32 h-32 p-1 bg-[#fffdfa] border border-[#ded3bd] rounded-lg">
                {gridA.map((isBlack, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const copy = [...gridA];
                      copy[i] = !copy[i];
                      setGridA(copy);
                    }}
                    className={`rounded transition-colors cursor-pointer border ${
                      isBlack ? 'bg-[#26201a] border-[#26201a]' : 'bg-[#fffdfa] border-[#ded3bd] hover:bg-[#f6eee0]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center text-xl font-bold text-[#8c7e6d]">＋</div>

            {/* Grid B */}
            <div className="md:col-span-2 flex flex-col items-center p-4 bg-[#f8f3e8] rounded-xl border border-[#e3d8c2]">
              <span className="text-xs font-bold text-[#4a3e31] mb-2">图形 B (点击格子翻转黑白)</span>
              <div className="grid grid-cols-2 gap-1 w-32 h-32 p-1 bg-[#fffdfa] border border-[#ded3bd] rounded-lg">
                {gridB.map((isBlack, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const copy = [...gridB];
                      copy[i] = !copy[i];
                      setGridB(copy);
                    }}
                    className={`rounded transition-colors cursor-pointer border ${
                      isBlack ? 'bg-[#26201a] border-[#26201a]' : 'bg-[#fffdfa] border-[#ded3bd] hover:bg-[#f6eee0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Result Output */}
          <div className="flex flex-col items-center p-5 bg-[#fef7ea] rounded-xl border border-[#ebdcb9]">
            <span className="text-xs font-bold text-[#854d0e] mb-2">运算结果</span>
            <div className="grid grid-cols-2 gap-1 w-32 h-32 p-1 bg-[#fffdfa] border-2 border-[#b45309] rounded-lg shadow-sm">
              {computeBitwiseResult().map((isBlack, i) => (
                <div
                  key={i}
                  className={`rounded ${isBlack ? 'bg-[#26201a]' : 'bg-[#fffdfa] border border-[#ded3bd]'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
