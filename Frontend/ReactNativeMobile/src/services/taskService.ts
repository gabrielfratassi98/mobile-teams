import { api } from './api';
import { Team } from './teamService';
import { CreateTaskDTO } from '../../../../Shared/validations';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Pendente' | 'Em Progresso' | 'Concluída';
  dueDate?: Date;
  teams?: Team[];
}

export const tasksService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  create: async (data: CreateTaskDTO): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateTaskDTO>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};