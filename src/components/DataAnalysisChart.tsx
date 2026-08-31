import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  LabelList,
} from 'recharts';
import { Calculator, Table as TableIcon, BarChart3, Check } from 'lucide-react';

interface DataAnalysisChartProps {
  type?: 'bar' | 'line' | 'table' | 'pie' | 'composed';
  title?: string;
  data?: any[];
  columns?: { key: string; label: string; unit?: string }[];
}

export const DataAnalysisChart: React.FC<DataAnalysisChartProps> = ({
  type = 'bar',
  title = '统计数据图表',
  data = [],
  columns = [],
}) => {
  const [showCalc, setShowCalc] = useState(false);
  const [showDataTable, setShowDataTable] = useState(true);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const handleCompute = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Safe math eval with basic arithmetic
      const sanitized = calcInput.replace(/[^0-9+\-*/().% ]/g, '');
      const withPercentage = sanitized.replace(/([0-9.]+)%/g, '($1/100)');
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${withPercentage})`)();
      setCalcResult(typeof res === 'number' ? Number(res.toFixed(4)).toString() : '计算错误');
    } catch {
      setCalcResult('表达式错误');
    }
  };

  // Determine series keys from data
  const dataKeys =
    data.length > 0
      ? Object.keys(data[0]).filter((k) => k !== 'name' && k !== 'metric' && k !== 'indicator')
      : [];

  const colors = ['#b45309', '#15803d', '#2563eb', '#c2410c', '#7c3aed', '#0891b2'];

  // Value formatter for direct permanent labels on charts
  const formatLabelValue = (val: any, key: string) => {
    if (val === undefined || val === null) return '';
    if (typeof val === 'number') {
      if (key.includes('增长') || key.includes('增速') || key.includes('率') || key.includes('占比') || key.includes('%')) {
        return `${val}%`;
      }
      return val >= 1000 ? val.toLocaleString() : `${val}`;
    }
    return `${val}`;
  };

  return (
    <div className="my-4 bg-[#f8f3e8] border border-[#e3d8c2] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Chart Title & Quick Tools Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e5dac6]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#fef7ea] border border-[#ebdcb9] flex items-center justify-center text-[#b45309]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#26201a] font-display">{title}</h4>
            <div className="flex items-center gap-2 text-[11px] text-[#786c5e] mt-0.5">
              <span className="flex items-center gap-1 text-[#15803d] font-semibold">
                <Check className="w-3 h-3" /> 数值已直接常显于图表与对照表
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Data Table */}
          {type !== 'table' && (
            <button
              type="button"
              onClick={() => setShowDataTable(!showDataTable)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                showDataTable
                  ? 'bg-[#fef7ea] text-[#854d0e] border-[#ebdcb9]'
                  : 'bg-[#fffdfa] border-[#ded2bd] text-[#786c5e] hover:bg-[#f6eee0]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{showDataTable ? '隐藏直读数据表' : '展开直读数据表'}</span>
            </button>
          )}

          {/* Quick Calc Scratchpad */}
          <button
            type="button"
            onClick={() => setShowCalc(!showCalc)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
              showCalc
                ? 'bg-[#b45309] text-white border-[#b45309]'
                : 'bg-[#fffdfa] border-[#ded2bd] text-[#4a3e31] hover:bg-[#f6eee0]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>速算演算草稿纸</span>
          </button>
        </div>
      </div>

      {/* Embedded Scratchpad / Calculator */}
      {showCalc && (
        <div className="p-3.5 bg-[#fef7eb] border border-[#ebdcb9] rounded-xl animate-in fade-in duration-150 space-y-2">
          <div className="text-xs font-bold text-[#854d0e] flex items-center justify-between">
            <span>🧮 资料分析速算草稿纸（支持加减乘除、括号、百分号如 52850/(1+5.4%)）</span>
            <span className="text-[11px] text-[#b45309] font-normal">敲 Enter 即刻计算</span>
          </div>
          <form onSubmit={handleCompute} className="flex gap-2">
            <input
              type="text"
              value={calcInput}
              onChange={(e) => setCalcInput(e.target.value)}
              placeholder="例: (306739/1.081) - (271392/1.073)"
              className="flex-1 px-3 py-1.5 text-xs bg-[#fffdfa] border border-[#dccfb7] rounded-lg focus:outline-[#b45309] font-mono text-[#26201a]"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#b45309] hover:bg-[#9a3412] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
            >
              计算
            </button>
          </form>
          {calcResult !== null && (
            <div className="mt-1 text-xs font-mono font-bold text-[#26201a] flex items-center gap-2">
              <span className="text-[#854d0e] font-normal">计算结果:</span>
              <span className="text-sm bg-[#fffdfa] px-2.5 py-1 rounded-lg border border-[#ebdcb9] text-[#b45309]">
                {calcResult}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Standalone Table Mode */}
      {type === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-[#ded3be] bg-[#fffdfa]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f5ede0] text-[#3b3127] font-bold border-b border-[#ded3be]">
                {columns.map((col) => (
                  <th key={col.key} className="px-3.5 py-2.5">
                    {col.label} {col.unit && <span className="font-normal text-[11px] text-[#786c5e]">({col.unit})</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede4d3]">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#faf6ee] transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3.5 py-2 font-mono font-medium text-[#26201a]">
                      {typeof row[col.key] === 'number' && (col.key.includes('增长') || col.key.includes('率'))
                        ? `${row[col.key]}%`
                        : row[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bar Chart Mode with Permanent Direct Numerical Labels */}
      {type === 'bar' && data.length > 0 && (
        <div className="h-64 sm:h-72 w-full pt-3 bg-[#fffdfa] p-3 rounded-xl border border-[#ded3be]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 24, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ded0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6e6153' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6e6153' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fdfbf7',
                  borderColor: '#decfa8',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              {dataKeys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[5, 5, 0, 0]}>
                  {/* DIRECT PERMANENT VALUE LABELS ON EVERY BAR */}
                  <LabelList
                    dataKey={key}
                    position="top"
                    offset={6}
                    fill="#26201a"
                    fontSize={11}
                    fontWeight={600}
                    formatter={(val: any) => formatLabelValue(val, key)}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Line Chart Mode with Permanent Direct Numerical Labels */}
      {type === 'line' && data.length > 0 && (
        <div className="h-64 sm:h-72 w-full pt-3 bg-[#fffdfa] p-3 rounded-xl border border-[#ded3be]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 24, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ded0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6e6153' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6e6153' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fdfbf7',
                  borderColor: '#decfa8',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              {dataKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={3}
                  dot={{ r: 4.5, fill: colors[i % colors.length] }}
                  activeDot={{ r: 6 }}
                >
                  {/* DIRECT PERMANENT VALUE LABELS ON EVERY DATA POINT */}
                  <LabelList
                    dataKey={key}
                    position="top"
                    offset={8}
                    fill="#26201a"
                    fontSize={11}
                    fontWeight={600}
                    formatter={(val: any) => formatLabelValue(val, key)}
                  />
                </Line>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Composed Chart (Bar + Line Dual Series) with Permanent Numerical Labels */}
      {type === 'composed' && data.length > 0 && (
        <div className="h-68 sm:h-76 w-full pt-3 bg-[#fffdfa] p-3 rounded-xl border border-[#ded3be]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 24, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ded0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6e6153' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6e6153' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fdfbf7',
                  borderColor: '#decfa8',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              {dataKeys.map((key, i) => {
                const isLine =
                  key.includes('增长') || key.includes('增速') || key.includes('率') || key.includes('占比') || key.includes('%');
                if (isLine) {
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke="#c2410c"
                      strokeWidth={3}
                      dot={{ r: 4.5, fill: '#c2410c' }}
                      activeDot={{ r: 6 }}
                    >
                      <LabelList
                        dataKey={key}
                        position="top"
                        offset={8}
                        fill="#9a3412"
                        fontSize={11}
                        fontWeight={700}
                        formatter={(val: any) => `${val}%`}
                      />
                    </Line>
                  );
                }
                return (
                  <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[5, 5, 0, 0]}>
                    <LabelList
                      dataKey={key}
                      position="top"
                      offset={6}
                      fill="#26201a"
                      fontSize={11}
                      fontWeight={600}
                      formatter={(val: any) => (typeof val === 'number' && val >= 1000 ? val.toLocaleString() : val)}
                    />
                  </Bar>
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* DIRECT NUMERICAL DATA MATRIX (ALWAYS DIRECTLY AVAILABLE FOR PRECISION READING) */}
      {type !== 'table' && showDataTable && data.length > 0 && (
        <div className="pt-2">
          <div className="bg-[#fffdfa] rounded-xl border border-[#ded3be] overflow-hidden">
            <div className="bg-[#f5ede0] px-3.5 py-2 border-b border-[#ded3be] flex items-center justify-between">
              <span className="text-xs font-bold text-[#3b3127] flex items-center gap-1.5">
                <TableIcon className="w-3.5 h-3.5 text-[#b45309]" />
                <span>精准数据直读对照明细表 (全数据直接呈现，无需悬停)</span>
              </span>
              <span className="text-[11px] text-[#786c5e]">共 {data.length} 项统计周期</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#faf6ee] text-[#5c4e3f] font-semibold border-b border-[#ede4d3]">
                    <th className="px-3.5 py-2">指标周期 / 对象</th>
                    {dataKeys.map((k) => (
                      <th key={k} className="px-3.5 py-2 font-semibold">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede4d3]">
                  {data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f6eee0] transition-colors">
                      <td className="px-3.5 py-2 font-semibold text-[#26201a]">
                        {row.name || row.metric || `第 ${idx + 1} 组`}
                      </td>
                      {dataKeys.map((k) => {
                        const val = row[k];
                        const isPercent =
                          k.includes('增长') || k.includes('增速') || k.includes('率') || k.includes('占比');
                        return (
                          <td key={k} className="px-3.5 py-2 font-mono font-medium text-[#26201a]">
                            {typeof val === 'number'
                              ? isPercent
                                ? `${val}%`
                                : val.toLocaleString()
                              : val ?? '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

