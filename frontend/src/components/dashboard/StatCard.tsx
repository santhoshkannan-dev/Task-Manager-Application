import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  indicator: string;
  colorScheme: 'purple' | 'emerald' | 'amber' | 'rose';
}

export function StatCard({
  label,
  value,
  icon: Icon,
  indicator,
  colorScheme,
}: StatCardProps) {
  const schemes = {
    purple: {
      bg: 'bg-brand-50/60',
      iconBg: 'bg-[#7050DC] text-white',
      border: 'border-brand-100/70',
      indicatorText: 'text-brand-700',
    },
    emerald: {
      bg: 'bg-emerald-50/50',
      iconBg: 'bg-emerald-500 text-white',
      border: 'border-emerald-100/80',
      indicatorText: 'text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50/50',
      iconBg: 'bg-[#F5A623] text-white',
      border: 'border-amber-100/80',
      indicatorText: 'text-amber-700',
    },
    rose: {
      bg: 'bg-rose-50/50',
      iconBg: 'bg-rose-500 text-white',
      border: 'border-rose-100/80',
      indicatorText: 'text-rose-700',
    },
  }[colorScheme];

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between relative overflow-hidden',
        schemes.border
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
          {label}
        </span>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shadow-sm', schemes.iconBg)}>
          <Icon className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs">
          <span className={cn('font-medium', schemes.indicatorText)}>
            {indicator}
          </span>
        </div>
      </div>
    </div>
  );
}

