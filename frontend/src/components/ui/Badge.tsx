import React from 'react';
import { cn } from '@/lib/utils';
import { Priority } from '@/types';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, className, size = 'sm' }: PriorityBadgeProps) {
  const config = {
    LOW: {
      label: 'Low',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    MEDIUM: {
      label: 'Medium',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500',
    },
    HIGH: {
      label: 'High',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
    },
  }[priority] || {
    label: priority,
    bg: 'bg-gray-50 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full tracking-wide',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.bg,
        className
      )}
    >
      <span className={cn('rounded-full shrink-0', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2', config.dot)} />
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  completed: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ completed, className, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full tracking-wide',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        completed
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
          : 'bg-purple-50 text-purple-700 border-purple-200/80',
        className
      )}
    >
      <span
        className={cn(
          'rounded-full shrink-0',
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
          completed ? 'bg-emerald-500' : 'bg-brand-500'
        )}
      />
      {completed ? 'Completed' : 'Pending'}
    </span>
  );
}

