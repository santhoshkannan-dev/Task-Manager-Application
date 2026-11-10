'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TaskSummary } from '@/types';

interface TaskCompletionChartProps {
  summary: TaskSummary | null;
}

export function TaskCompletionChart({ summary }: TaskCompletionChartProps) {
  const completed = summary?.completed || 0;
  const pending = summary?.pending || 0;
  const total = completed + pending;

  const data = [
    { name: 'Completed', value: completed, color: '#10B981' },
    { name: 'Pending', value: pending, color: '#7050DC' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-charcoal tracking-tight">Status Breakdown</h4>
        <p className="text-xs text-charcoal-muted mt-0.5">Completed vs Pending ratio</p>
      </div>

      <div className="h-64 w-full relative flex items-center justify-center">
        {total === 0 ? (
          <div className="text-xs text-charcoal-muted">No task records available</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                      return (
                        <div className="bg-white p-2.5 rounded-xl border border-surface-border shadow-modal text-xs">
                          <span className="font-semibold text-charcoal block">{item.name}</span>
                          <span className="text-charcoal-muted">{item.value} tasks ({pct}%)</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Rate Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-charcoal">
                {total > 0 ? Math.round((completed / total) * 100) : 0}%
              </span>
              <span className="text-[10px] uppercase font-semibold text-charcoal-muted">
                Completed
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-charcoal-muted">{item.name}:</span>
            <span className="font-semibold text-charcoal">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

