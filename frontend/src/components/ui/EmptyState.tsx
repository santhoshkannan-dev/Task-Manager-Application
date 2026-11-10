import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No tasks found',
  description = 'You have no tasks matching the selected criteria. Create a new task to get started.',
  actionLabel = 'Create Task',
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-surface-border my-6">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 mb-4 shadow-sm">
        {icon || <ClipboardList className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-charcoal mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

