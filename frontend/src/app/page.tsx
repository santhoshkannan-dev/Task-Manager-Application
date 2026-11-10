'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskProgress } from '@/components/dashboard/TaskProgress';
import { RecentTasks } from '@/components/dashboard/RecentTasks';
import { TaskModal } from '@/components/tasks/TaskModal';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { Task, TaskSummary } from '@/types';
import { taskApi } from '@/services/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const loadDashboardData = useCallback(async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const [fetchedTasks, fetchedSummary] = await Promise.all([
        taskApi.getTasks({ sort: 'newest' }),
        taskApi.getTaskSummary(),
      ]);
      setTasks(fetchedTasks);
      setSummary(fetchedSummary);
      if (showToast) {
        toast.success('Workspace synchronized with PostgreSQL');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleToggleComplete = async (task: Task) => {
    try {
      const updated = await taskApi.toggleComplete(task.id);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updated : t))
      );
      toast.success(
        updated.completed
          ? `Marked "${updated.title}" as completed!`
          : `Restored "${updated.title}" to pending.`
      );
      // Reload summary stats
      const updatedSummary = await taskApi.getTaskSummary();
      setSummary(updatedSummary);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update task completion');
    }
  };

  const handleTaskSuccess = async () => {
    await loadDashboardData();
  };

  const handleDeleteSuccess = async (deletedId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
    const updatedSummary = await taskApi.getTaskSummary();
    setSummary(updatedSummary);
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card relative overflow-hidden">
        {/* Soft Lavender Background Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-50 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Good morning, welcome back!
          </h1>
          <p className="text-sm text-charcoal-muted mt-1.5 max-w-lg leading-relaxed">
            Here&apos;s what&apos;s happening with your tasks today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => loadDashboardData(true)}
            isLoading={isRefreshing}
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={openCreateModal}
            className="shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
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
              label="Total Tasks"
              value={summary?.total ?? 0}
              icon={CheckSquare}
              indicator="All registered workspace items"
              colorScheme="purple"
            />
            <StatCard
              label="Completed Tasks"
              value={summary?.completed ?? 0}
              icon={CheckCircle2}
              indicator={`${summary?.completion_rate ?? 0}% completed`}
              colorScheme="emerald"
            />
            <StatCard
              label="Pending Tasks"
              value={summary?.pending ?? 0}
              icon={Clock}
              indicator="Requires attention"
              colorScheme="amber"
            />
            <StatCard
              label="High Priority Tasks"
              value={summary?.high_priority ?? 0}
              icon={AlertCircle}
              indicator="Critical milestone items"
              colorScheme="rose"
            />
          </>
        )}
      </div>

      {/* Task Progress Section */}
      <TaskProgress summary={summary} />

      {/* Recent Tasks List */}
      <RecentTasks
        tasks={tasks}
        isLoading={isLoading}
        onToggleComplete={handleToggleComplete}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onCreateNew={openCreateModal}
      />

      {/* Create / Edit Modal */}
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

