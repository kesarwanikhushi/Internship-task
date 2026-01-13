import { apiService } from './api';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    return apiService.get<Task[]>('/tasks');
  },

  async getTask(id: string): Promise<Task> {
    return apiService.get<Task>(`/tasks/${id}`);
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    return apiService.post<Task>('/tasks', data);
  },

  async updateTask(id: string, data: Partial<CreateTaskData>): Promise<Task> {
    return apiService.put<Task>(`/tasks/${id}`, data);
  },

  async deleteTask(id: string): Promise<void> {
    return apiService.delete(`/tasks/${id}`);
  },
};
