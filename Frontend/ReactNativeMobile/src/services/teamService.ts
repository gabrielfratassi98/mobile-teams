import { api } from './api';

export interface Team {
  id: string;
  name: string;
  colorHex?: string;
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