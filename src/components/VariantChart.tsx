import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts';

const CHART_COLORS = ['#b45309', '#047857', '#4338ca', '#b91c1c', '#92400e'];

/** AI 生成的资料分析变式图表：直接展示数值标签，像真实题目一样可读 */
export const VariantChart: React.FC<{ chart: any }> = ({ chart }) => {
  if (!chart) return null;

  const titleNode = chart.title ? (
    <div className="text-center font-bold text-[#26201a] text-sm mb-2">
      {chart.title}
      {chart.unit ? <span className="text-xs text-[#786c5e] font-medium ml-1">（单位：{chart.unit}）</span> : null}
    </div>
  ) : null;

  if (chart.type === 'table') {
    return (
      <div className="my-3 bg-white rounded-xl border border-[#ded3bd] p-3">
        {titleNode}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {(chart.columns || []).map((col: string, i: number) => (
                  <th key={i} className="border border-[#ded3bd] bg-[#f6efe2] px-2.5 py-2 font-bold text-[#4a3e31]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(chart.rows || []).map((row: any[], ri: number) => (
                <tr key={ri}>
                  {row.map((cell: any, ci: number) => (
                    <td key={ci} className="border border-[#e8ded0] px-2.5 py-1.5 text-center text-[#4a3e31]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (chart.type === 'pie') {
    const pieData = (chart.categories || []).map((cat: string, i: number) => ({
      name: cat,
      value: chart.series?.[0]?.data?.[i] ?? 0,
    }));
    return (
      <div className="my-3 bg-white rounded-xl border border-[#ded3bd] p-3">
        {titleNode}
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={78}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // bar / line（柱状与折线共用：每个数据点直接显示数值）
  const isLine = chart.type === 'line';
  const data = (chart.categories || []).map((cat: string, i: number) => {
    const row: Record<string, any> = { name: cat };
    (chart.series || []).forEach((s: any) => {
      row[s.name] = s.data?.[i] ?? 0;
    });
    return row;
  });
  const ChartComp = isLine ? LineChart : BarChart;

  return (
    <div className="my-3 bg-white rounded-xl border border-[#ded3bd] p-3">
      {titleNode}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComp data={data} margin={{ top: 20, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ded0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4a3e31' }} />
            <YAxis tick={{ fontSize: 10, fill: '#8c7e6d' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {(chart.series || []).map((s: any, i: number) =>
              isLine ? (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={2}
                >
                  <LabelList dataKey={s.name} position="top" style={{ fontSize: 10, fill: '#4a3e31' }} />
                </Line>
              ) : (
                <Bar
                  key={s.name}
                  dataKey={s.name}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey={s.name} position="top" style={{ fontSize: 10, fill: '#4a3e31' }} />
                </Bar>
              )
            )}
          </ChartComp>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
