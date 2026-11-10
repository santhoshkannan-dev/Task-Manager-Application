import { Task, TaskSummary, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMessage = json?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMessage);
  }
  return json.data as T;
}

export const taskApi = {
  /**
   * Fetch all tasks with optional filters
   */
  async getTasks(params?: {
    search?: string;
    priority?: string;
    completed?: boolean | string;
    sort?: string;
  }): Promise<Task[]> {
    const url = new URL(`${API_BASE_URL}/tasks`);
    if (params) {
      if (params.search) url.searchParams.set('search', params.search);
      if (params.priority && params.priority !== 'ALL') url.searchParams.set('priority', params.priority);
      if (params.completed !== undefined && params.completed !== 'ALL') {
        url.searchParams.set('completed', String(params.completed));
      }
      if (params.sort) url.searchParams.set('sort', params.sort);
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<Task[]>(res);
  },

  /**
   * Fetch a single task by ID
   */
  async getTaskById(id: number): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<Task>(res);
  },

  /**
   * Create a new task
   */
  async createTask(data: {
    title: string;
    description?: string | null;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(res);
  },

  /**
   * Update an existing task
   */
  async updateTask(
    id: number,
    data: {
      title?: string;
      description?: string | null;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH';
      completed?: boolean;
    }
  ): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(res);
  },

  /**
   * Toggle or set completion status
   */
  async toggleComplete(id: number, completed?: boolean): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: completed !== undefined ? JSON.stringify({ completed }) : undefined,
    });
    return handleResponse<Task>(res);
  },

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<Task>(res);
  },

  /**
   * Fetch real database task summary / analytics
   */
  async getTaskSummary(): Promise<TaskSummary> {
    const res = await fetch(`${API_BASE_URL}/tasks/stats/summary`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<TaskSummary>(res);
  },

  /**
   * Backend health check
   */
  async checkHealth(): Promise<{ status: string; database: { connected: boolean } }> {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return res.json();
  },
};

