import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AttendanceRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export function AttendanceRing({ percentage, size = 200, strokeWidth = 20 }: AttendanceRingProps) {
  const data = [
    { name: 'Present', value: percentage },
    { name: 'Absent', value: 100 - percentage },
  ];

  const COLORS = ['#16A34A', '#E2E8F0'];

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={strokeWidth / 2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold text-text tracking-tight">{percentage}%</span>
        <span className="text-sm font-medium text-gray-500">Attendance</span>
      </div>
    </div>
  );
}