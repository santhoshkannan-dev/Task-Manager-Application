'use client';

import React from 'react';
import { Search, X, LayoutGrid, ListFilter, ArrowUpDown } from 'lucide-react';
import { TaskFiltersState, ViewMode, Priority } from '@/types';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<TaskFiltersState>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  totalResults?: number;
  hideStatusFilter?: boolean;
}

export function TaskFilters({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  totalResults,
  hideStatusFilter = false,
}: TaskFiltersProps) {
  const priorities: { value: 'ALL' | Priority; label: string }[] = [
    { value: 'ALL', label: 'All Priority' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const statuses: { value: 'ALL' | 'PENDING' | 'COMPLETED'; label: string }[] = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="space-y-3.5 mb-6">
      {/* Top row: Search & View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-surface-border rounded-xl placeholder-charcoal-light text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode & Sort */}
        <div className="flex items-center gap-2 justify-end">
          {/* Sort Selector */}
          <div className="relative flex items-center">
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sort: e.target.value as 'newest' | 'oldest' | 'priority',
                }))
              }
              className="appearance-none bg-white border border-surface-border text-xs font-medium text-charcoal pl-3 pr-8 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-muted absolute right-2.5 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-surface-border">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                viewMode === 'grid'
                  ? 'bg-white text-[#7050DC] shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal'
              )}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                viewMode === 'list'
                  ? 'bg-white text-[#7050DC] shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal'
              )}
              title="List View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter pills */}
          <div className="inline-flex rounded-xl bg-gray-100/80 p-0.5 border border-surface-border">
            {priorities.map((p) => (
              <button
                key={p.value}
                onClick={() => setFilters((prev) => ({ ...prev, priority: p.value }))}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-all text-xs',
                  filters.priority === p.value
                    ? 'bg-white text-charcoal shadow-sm font-semibold'
                    : 'text-charcoal-muted hover:text-charcoal'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Status filter pills (if not hidden) */}
          {!hideStatusFilter && (
            <div className="inline-flex rounded-xl bg-gray-100/80 p-0.5 border border-surface-border">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setFilters((prev) => ({ ...prev, status: s.value }))}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-medium transition-all text-xs',
                    filters.status === s.value
                      ? 'bg-white text-charcoal shadow-sm font-semibold'
                      : 'text-charcoal-muted hover:text-charcoal'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {totalResults !== undefined && (
          <span className="text-xs text-charcoal-muted font-medium ml-auto">
            Showing <span className="font-semibold text-charcoal">{totalResults}</span> {totalResults === 1 ? 'task' : 'tasks'}
          </span>
        )}
      </div>
    </div>
  );
}

