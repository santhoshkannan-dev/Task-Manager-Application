'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TaskSummary } from '@/types';

interface PriorityDistributionChartProps {
  summary: TaskSummary | null;
}

export function PriorityDistributionChart({ summary }: PriorityDistributionChartProps) {
  const data = [
    {
      name: 'High',
      count: summary?.high_priority || 0,
      color: '#EF4444', // Red
    },
    {
      name: 'Medium',
      count: summary?.medium_priority || 0,
      color: '#F5A623', // Amber
    },
    {
      name: 'Low',
      count: summary?.low_priority || 0,
      color: '#10B981', // Green
    },
  ];

  const total = (summary?.high_priority || 0) + (summary?.medium_priority || 0) + (summary?.low_priority || 0);

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-charcoal tracking-tight">Priority Distribution</h4>
        <p className="text-xs text-charcoal-muted mt-0.5">Tasks grouped by urgency</p>
      </div>

      <div className="h-64 w-full">
        {total === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-charcoal-muted">
            No priority data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(112, 80, 220, 0.04)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white p-2.5 rounded-xl border border-surface-border shadow-modal text-xs">
                        <span className="font-semibold text-charcoal block">{item.name} Priority</span>
                        <span className="text-charcoal-muted">{item.count} tasks</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-gray-100 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-charcoal-muted">{item.name}:</span>
            <span className="font-semibold text-charcoal">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

