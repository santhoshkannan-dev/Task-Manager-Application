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
import { Button } from '@/components/ui/Button';
import { Plus, ListTodo } from 'lucide-react';
import { toast } from 'sonner';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    priority: 'ALL',
    status: 'PENDING',
    sort: 'priority',
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const fetchMyTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams: any = {
        completed: false,
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
      toast.error(err.message || 'Failed to fetch your tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMyTasks();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchMyTasks]);

  const handleToggleComplete = async (task: Task) => {
    try {
      const updated = await taskApi.toggleComplete(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      toast.success(`Completed "${updated.title}"! Moved to Completed archive.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update task');
    }
  };

  const handleTaskSuccess = async () => {
    await fetchMyTasks();
  };

  const handleDeleteSuccess = (deletedId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2.5">
            <ListTodo className="w-6 h-6 text-[#7050DC]" />
            My Active Tasks
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Focus on your active backlog and high-priority action items
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </Button>
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
            title="All caught up!"
            description="You have no pending tasks assigned in this view. Great job!"
            actionLabel="Add New Task"
            onAction={openCreateModal}
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
                onToggleComplete={handleToggleComplete}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={editingTask}
        onSuccess={handleTaskSuccess}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        task={deletingTask}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
