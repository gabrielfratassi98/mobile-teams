import { prisma } from '../server.js';
import { Result } from '../utils/result.js';

export class TaskService {
  async createTask(data: { 
    title: string; 
    description?: string; 
    status?: string; 
    dueDate?: Date; 
    teamIds?: string[] 
  }): Promise<Result<any, any>> {
    const task = await prisma.task.create({
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

    if (!task) {
      return { 
        success: false, 
        code: 400,
        message: "Não foi possível criar a tarefa"
      };
    }

    return { 
      success: true, 
      data: task 
    };
  }

  async getTasks(
    limit: number = 10, 
    offset: number = 0, 
    search?: string,
    teamId?: string,
    status?: string,
    sort?: string
  ): Promise<Result<any, any>> {
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

    if (!data) {
      return { 
        success: false, 
        code: 404,
        message: "Nenhuma tarefa encontrada"
      };
    }

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return { 
      success: true, 
      data: data,
      meta: { 
        total, 
        limit, 
        offset,
        currentPage,
        totalPages
      },
    };
  }

  async getById(id: string): Promise<Result<any, any>> {
    const task = await prisma.task.findFirst({
      where: { id },
      include: {
        teams: true
      }
    });

    if (!task) {
      return { 
        success: false, 
        code: 404,
        message: "Nenhuma tarefa encontrada"
      };
    }

    return { 
      success: true, 
      data: task
    };
  } 
  
  async updateTask(id: string, data: { 
    title?: string; 
    description?: string; 
    status?: string; 
    dueDate?: Date; 
    teamIds?: string[] 
  }): Promise<Result<any, any>> {
    const task = await prisma.task.update({
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

    if (!task) {
      return { 
        success: false, 
        code: 400,
        message: "Tarefa não atualizada"
      };
    }

    return { 
      success: true, 
      data: task
    };
  }

  async deleteTask(id: string): Promise<Result<any, any>> {
    const task = await prisma.task.delete({
      where: { id },
    });

    if (!task) {
      return { 
        success: false, 
        code: 400,
        message: "Tarefa não deletada"
      };
    }

    return { 
      success: true, 
      data: task
    };
  }

  async deleteTeamTask(taskId: string, teamId: string): Promise<Result<any, any>> {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        teams: {
          disconnect: { id: teamId }
        }
      },
      include: { teams: true }
    });

    if (!task) {
      return { 
        success: false, 
        code: 400,
        message: "Vínculo não removido"
      };
    }

    return {
      success: true,
      data: task
    };
  }
}
