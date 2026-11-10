'use client';

import React, { useState, useEffect } from 'react';
import { TaskSummary } from '@/types';
import { taskApi } from '@/services/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { PriorityDistributionChart } from '@/components/charts/PriorityDistributionChart';
import { TaskCompletionChart } from '@/components/charts/TaskCompletionChart';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const data = await taskApi.getTaskSummary();
        setSummary(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-[#7050DC]" />
          Productivity Analytics
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
          Detailed metrics and live distributions derived directly from your PostgreSQL task store
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Work Items"
              value={summary?.total ?? 0}
              icon={CheckSquare}
              indicator="Recorded in PostgreSQL"
              colorScheme="purple"
            />
            <StatCard
              label="Completed Tasks"
              value={summary?.completed ?? 0}
              icon={CheckCircle2}
              indicator={`${summary?.completion_rate ?? 0}% completed rate`}
              colorScheme="emerald"
            />
            <StatCard
              label="Pending Work"
              value={summary?.pending ?? 0}
              icon={Clock}
              indicator="Active in backlog"
              colorScheme="amber"
            />
            <StatCard
              label="High Priority"
              value={summary?.high_priority ?? 0}
              icon={AlertCircle}
              indicator="Needs urgent action"
              colorScheme="rose"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityDistributionChart summary={summary} />
        <TaskCompletionChart summary={summary} />
      </div>

      {/* Deep-Dive Metric Table / Insights */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#7050DC]" />
          <h3 className="text-sm font-bold text-charcoal">Workspace Breakdown Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-charcoal-muted font-medium block">Completion Velocity</span>
              <span className="text-lg font-bold text-charcoal">{summary?.completion_rate ?? 0}%</span>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                {summary?.completed ?? 0} of {summary?.total ?? 0} tasks resolved
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-[#7050DC] flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-charcoal-muted font-medium block">Priority Distribution</span>
              <span className="text-lg font-bold text-charcoal">
                {summary?.high_priority ?? 0}H / {summary?.medium_priority ?? 0}M / {summary?.low_priority ?? 0}L
              </span>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                Ratio of urgency across database
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#F5A623] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-charcoal-muted font-medium block">Pending Backlog</span>
              <span className="text-lg font-bold text-charcoal">{summary?.pending ?? 0} Tasks</span>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                Current operational backlog
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

