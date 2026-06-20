import { prisma } from '../server.js';

export class TaskService {
  async createTask(data: { 
    title: string; 
    description?: string; 
    status?: string; 
    dueDate?: Date; 
    teamIds?: string[] 
  }) {
    return await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'Pendente',
        dueDate: data.dueDate,
        teams: {
          connect: data.teamIds?.map((id) => ({ id })) || [],
        },
      },
      include: {
        teams: true,
      }
    });
  }

  async getTasks(
    limit: number = 10, 
    offset: number = 0, 
    search?: string,
    teamId?: string,
    status?: string,
    sort?: string
  ) {
    const where: any = {};
    
    if (search) where.title = { contains: search };
    if (status) where.status = status;
    if (teamId) {
      where.teams = {
        some: { id: teamId }
      };
    }
    
    const orderBy: any = sort ? { [sort]: 'desc' } : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy,
        include: { teams: true },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data,
      meta: { total, limit, offset },
    };
  }

  async getById(id: string) {
    return await prisma.task.findFirst({
      where: { id },
      include: {
        teams: true
      }
    })
  } 
  
  async updateTask(id: string, data: { 
    title?: string; 
    description?: string; 
    status?: string; 
    dueDate?: Date; 
    teamIds?: string[] 
  }) {
    return await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
        teams: data.teamIds ? {
          set: data.teamIds.map((teamId) => ({ id: teamId }))
        } : undefined,
      },
      include: { teams: true }
    });
  }

  async deleteTask(id: string) {
    return await prisma.task.delete({
      where: { id },
    });
  }

  async deleteTeamTask(taskId: string, teamId: string) {
    return await prisma.task.update({
      where: { 
        id: taskId
      },
      data: {
        teams: {
          disconnect: { id: teamId }
        }
      },
      include: {
        teams: true
      }
    });
  }
}