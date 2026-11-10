import React from 'react';
import { TaskSummary } from '@/types';
import { CheckCircle2, Clock, Target } from 'lucide-react';

interface TaskProgressProps {
  summary: TaskSummary | null;
}

export function TaskProgress({ summary }: TaskProgressProps) {
  const total = summary?.total || 0;
  const completed = summary?.completed || 0;
  const pending = summary?.pending || 0;
  const rate = summary?.completion_rate || 0;

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-charcoal tracking-tight flex items-center gap-2">
            <Target className="w-4 h-4 text-[#7050DC]" />
            Task Completion Rate
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Real-time PostgreSQL tracking of your active workspace
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-[#7050DC] tracking-tight">{rate}%</span>
          <span className="block text-[10px] text-charcoal-muted uppercase font-semibold">Done</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 mb-4">
        <div
          className="bg-gradient-to-r from-[#7050DC] to-[#A78BFA] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
        />
      </div>

      {/* Counts Row */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/70">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-900 block">{completed} Tasks</span>
            <span className="text-[11px] text-emerald-700">Completed</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100/70">
          <Clock className="w-4 h-4 text-[#F5A623] shrink-0" />
          <div>
            <span className="font-bold text-amber-900 block">{pending} Tasks</span>
            <span className="text-[11px] text-amber-700">In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}

