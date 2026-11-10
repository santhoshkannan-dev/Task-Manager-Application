'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Task, Priority } from '@/types';
import { taskApi } from '@/services/api';
import { toast } from 'sonner';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'Priority is required',
  }),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  onSuccess: (task: Task, isEdit: boolean) => void;
}

export function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  onSuccess,
}: TaskModalProps) {
  const isEditing = Boolean(taskToEdit);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
    },
  });

  const selectedPriority = watch('priority');

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        reset({
          title: taskToEdit.title,
          description: taskToEdit.description || '',
          priority: taskToEdit.priority,
        });
      } else {
        reset({
          title: '',
          description: '',
          priority: 'MEDIUM',
        });
      }
    }
  }, [isOpen, taskToEdit, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEditing && taskToEdit) {
        const updated = await taskApi.updateTask(taskToEdit.id, {
          title: data.title,
          description: data.description ? data.description.trim() : null,
          priority: data.priority,
        });
        toast.success('Task updated successfully');
        onSuccess(updated, true);
      } else {
        const created = await taskApi.createTask({
          title: data.title,
          description: data.description ? data.description.trim() : null,
          priority: data.priority,
        });
        toast.success('Task created successfully');
        onSuccess(created, false);
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save task');
    }
  };

  const priorityOptions: { value: Priority; label: string; color: string; activeColor: string }[] = [
    {
      value: 'LOW',
      label: 'Low Priority',
      color: 'border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50',
      activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 font-semibold',
    },
    {
      value: 'MEDIUM',
      label: 'Medium Priority',
      color: 'border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-50',
      activeColor: 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20 font-semibold',
    },
    {
      value: 'HIGH',
      label: 'High Priority',
      color: 'border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-50',
      activeColor: 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20 font-semibold',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      description={
        isEditing
          ? 'Update the details and priority of your task.'
          : 'Add a new task to your workspace to stay on track.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g., Conduct design review with team"
            className={cn(
              'w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-charcoal placeholder-charcoal-light focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all',
              errors.title ? 'border-rose-400 focus:ring-rose-400/30' : 'border-surface-border'
            )}
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
            Description <span className="text-charcoal-light font-normal lowercase">(optional)</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Add relevant notes, links, or specifications..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-sm text-charcoal placeholder-charcoal-light focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none transition-all"
          />
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
            Priority Level <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {priorityOptions.map((opt) => {
              const isSelected = selectedPriority === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setValue('priority', opt.value, { shouldValidate: true })}
                  className={cn(
                    'flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all duration-150',
                    isSelected ? opt.activeColor : opt.color
                  )}
                >
                  <Flag className="w-3.5 h-3.5 mb-1" />
                  <span>{opt.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
          {errors.priority && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.priority.message}</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

