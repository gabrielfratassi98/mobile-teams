import { api } from './api';

export type TaskStatus = 'pendente' | 'em progresso' | 'concluída';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  teamId: string;
  teamName?: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  teamId: string;
  status?: TaskStatus; 
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