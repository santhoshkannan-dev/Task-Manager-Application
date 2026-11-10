'use client';

import React, { useState } from 'react';
import { Task, ViewMode } from '@/types';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Check, Edit2, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  viewMode?: ViewMode;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({
  task,
  viewMode = 'grid',
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToggling(true);
    try {
      await onToggleComplete(task);
    } finally {
      setIsToggling(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'group bg-white rounded-xl border transition-all duration-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-card hover:border-brand-200',
          task.completed ? 'bg-gray-50/60 border-gray-200/80' : 'border-surface-border'
        )}
      >
        {/* Left: Checkbox & Info */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={cn(
              'w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0',
              task.completed
                ? 'bg-[#7050DC] border-[#7050DC] text-white'
                : 'border-gray-300 hover:border-[#7050DC] bg-white'
            )}
            title={task.completed ? 'Mark as pending' : 'Mark as complete'}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={cn(
                  'text-sm font-semibold text-charcoal truncate transition-colors',
                  task.completed && 'line-through text-charcoal-muted font-normal'
                )}
              >
                {task.title}
              </h4>
            </div>
            {task.description && (
              <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Badges, Date, Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge completed={task.completed} />
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-charcoal-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(task.created_at)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-charcoal-muted hover:text-[#7050DC] hover:bg-brand-50 transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-lg text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode Card
  return (
    <div
      className={cn(
        'group bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between hover:shadow-card-hover hover:border-brand-200 relative overflow-hidden',
        task.completed ? 'bg-gray-50/60 border-gray-200/80' : 'border-surface-border'
      )}
    >
      <div>
        {/* Top bar: Badges & Checkbox */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge completed={task.completed} />
          </div>

          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={cn(
              'w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0',
              task.completed
                ? 'bg-[#7050DC] border-[#7050DC] text-white shadow-sm'
                : 'border-gray-300 hover:border-[#7050DC] bg-white'
            )}
            title={task.completed ? 'Mark as pending' : 'Mark as complete'}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
        </div>

        {/* Title */}
        <h4
          className={cn(
            'text-sm font-semibold text-charcoal mb-1.5 leading-snug transition-colors line-clamp-2',
            task.completed && 'line-through text-charcoal-muted font-normal'
          )}
        >
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed mb-4">
          {task.description || 'No additional details provided.'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 mt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(task.created_at)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-[#7050DC] hover:bg-brand-50 transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

