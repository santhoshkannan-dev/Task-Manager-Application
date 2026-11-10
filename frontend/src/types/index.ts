export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
  completion_rate: number;
}

export interface TaskFiltersState {
  search: string;
  priority: 'ALL' | Priority;
  status: 'ALL' | 'COMPLETED' | 'PENDING';
  sort: 'newest' | 'oldest' | 'priority';
}

export type ViewMode = 'grid' | 'list';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  error?: string;
}

