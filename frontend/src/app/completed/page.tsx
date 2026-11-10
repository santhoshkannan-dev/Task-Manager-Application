'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskFiltersState, ViewMode } from '@/types';
import { taskApi } from '@/services/api';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskModal } from '@/components/tasks/TaskModal';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { TaskCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function CompletedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    priority: 'ALL',
    status: 'COMPLETED',
    sort: 'newest',
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const fetchCompletedTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams: any = {
        completed: true,
        sort: filters.sort,
      };

      if (filters.search.trim()) {
        queryParams.search = filters.search.trim();
      }

      if (filters.priority !== 'ALL') {
        queryParams.priority = filters.priority;
      }

      const fetched = await taskApi.getTasks(queryParams);
      setTasks(fetched);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch completed tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompletedTasks();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchCompletedTasks]);

  const handleRestoreToPending = async (task: Task) => {
    try {
      // Toggle completion status back to false
      await taskApi.toggleComplete(task.id, false);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      toast.success(`Restored "${task.title}" to pending workspace.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to restore task');
    }
  };

  const handleTaskSuccess = async () => {
    await fetchCompletedTasks();
  };

  const handleDeleteSuccess = (deletedId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setDeletingTask(task);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2.5">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          Completed Tasks
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
          Review accomplished milestones or restore tasks back to pending
        </p>
      </div>

      {/* Filter and Content Container */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-border shadow-card">
        <TaskFilters
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalResults={tasks.length}
          hideStatusFilter
        />

        {isLoading ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No completed tasks yet"
            description="When you finish tasks and mark their checkboxes, they will appear here in your completed archive."
            icon={<CheckCircle2 className="w-7 h-7 text-emerald-500" />}
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                viewMode={viewMode}
                onToggleComplete={handleRestoreToPending}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={editingTask}
        onSuccess={handleTaskSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        task={deletingTask}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

