import { api } from './api';
import { CreateTaskDTO } from '../../../../Shared/validations';
import { Team } from './teamService';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Pendente' | 'Em Progresso' | 'Concluída';
  teamIds?: string[];
  teamName?: string;
  teams?: Team[];
}

export const tasksService = {
  getTasks: async (search?: string): Promise<Task[]> => {
    const url = `/tasks?search=${search}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  getTasksByTeamId: async (teamId?: string): Promise<Task[]> => {
    const url = `/tasks?teamId=${teamId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  create: async (data: CreateTaskDTO): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTaskDTO>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};