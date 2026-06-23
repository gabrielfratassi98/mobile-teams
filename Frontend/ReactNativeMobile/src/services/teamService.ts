import { api } from './api';
import { Task } from './taskService';

export interface Team {
  id: string;
  name: string;
  colorHex?: string;
  tasks?: Task[]
}

export interface CreateTeamDTO {
  name: string;
  colorHex?: string;
}

export const teamsService = {
  getTeams: async (search: string): Promise<Team[]> => {
    const response = await api.get(`/teams?search=${search}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Team> => {
    const response = await api.get(`/teams/${id}`);
    return response.data.data;
  },

  getTasksTeamById: async (id: string): Promise<Task[]> => {
    try {
      const response = await api.get(`/teams/${id}/tasks`);
      return response.data.data;
    }
    catch {
      return [];
    }
  },

  create: async (data: CreateTeamDTO): Promise<Team> => {
    const response = await api.post('/teams', data);
    return response.data.data; 
  },

  update: async (id: string, data: Partial<CreateTeamDTO>): Promise<Team> => {
    const response = await api.put(`/teams/${id}`, data); 
    return response.data.data; 
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/teams/${id}`);
  }
};