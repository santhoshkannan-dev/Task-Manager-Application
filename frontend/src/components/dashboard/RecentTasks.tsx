'use client';

import React from 'react';
import Link from 'next/link';
import { Task } from '@/types';
import { TaskCard } from '@/components/tasks/TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { TaskCardSkeleton } from '@/components/ui/Skeleton';
import { ArrowRight, Sparkles } from 'lucide-react';

interface RecentTasksProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreateNew: () => void;
}

export function RecentTasks({
  tasks,
  isLoading,
  onToggleComplete,
  onEdit,
  onDelete,
  onCreateNew,
}: RecentTasksProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-charcoal tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7050DC]" />
            Recent Tasks
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Your most recently created or updated work items
          </p>
        </div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7050DC] hover:text-[#5F3EC9] transition-colors"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Get started by creating your first task in TaskFlow."
          actionLabel="Create First Task"
          onAction={onCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.slice(0, 6).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              viewMode="grid"
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

