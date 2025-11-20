import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MacroBreakdown } from '../types';

interface MacroChartProps {
  macros: MacroBreakdown;
  size?: 'sm' | 'lg';
}

const MacroChart: React.FC<MacroChartProps> = ({ macros, size = 'lg' }) => {
  const data = [
    { name: 'Protein', value: macros.protein, color: '#10b981' }, // emerald-500
    { name: 'Carbs', value: macros.carbs, color: '#3b82f6' }, // blue-500
    { name: 'Fat', value: macros.fat, color: '#f59e0b' }, // amber-500
  ];

  const outerRadius = size === 'lg' ? 80 : 40;
  const innerRadius = size === 'lg' ? 60 : 30;

  return (
    <div className={`relative ${size === 'lg' ? 'h-48 w-48' : 'h-24 w-24'} mx-auto`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}g`, '']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text for Total Calories if Large */}
      {size === 'lg' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-gray-400">Macros</span>
        </div>
      )}
    </div>
  );
};

export default MacroChart;