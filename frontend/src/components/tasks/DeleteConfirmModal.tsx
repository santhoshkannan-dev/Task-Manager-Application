'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Task } from '@/types';
import { taskApi } from '@/services/api';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSuccess: (deletedId: number) => void;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  task,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(task.id);
      toast.success('Task deleted successfully');
      onSuccess(task.id);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-rose-900">&ldquo;{task.title}&rdquo;</span>? This action is permanent and will remove it from the PostgreSQL database.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
}

