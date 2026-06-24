import { prisma } from '../server.js';
import { Result } from '../utils/result.js'

export class TeamService {
  async createTeam(data: { name: string; colorHex: string; description?: string }): Promise<Result<any, any>> {
    const team = await prisma.team.create({
      data,
    });

    if (!team) {
      return { 
        success: false, 
        code: 400,
        message: "Não foi possível criar o time"
      } 
    };

    return { 
      success: true, 
      data: team 
    };
  }

  async getTeams(limit: number = 10, offset: number = 0, search?: string): Promise<Result<any, any>> {
    const where = search
      ? { name: { contains: search } }
      : {};

    const [data, total] = await Promise.all([
      prisma.team.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    if (!data) {
      return { 
        success: false, 
        code: 404,
        message: "Nenhum time encontrado"
      }   
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
      }
  }

  async getById(id: string) {
    const team = await prisma.team.findFirst({
      where: { id }
    });

    if (!team) {
      return { 
        success: false, 
        code: 404,
        message: "Nenhum time encontrado"
      }
    }

    return { 
        success: true, 
        data: team
      }
  }

  async updateTeam(id: string, data: { name?: string; colorHex?: string; description?: string }) {
    const team = await prisma.team.update({
      where: { id },
      data,
    });

    if (!team) {
      return { 
        success: false, 
        code: 400,
        message: "Time não atualizado"
      }
    }

    return { 
        success: true, 
        data: team
      };
  }

  async deleteTeam(id: string) {
    const team = await prisma.team.delete({
      where: { id },
    });

    if (!team) {
      return { 
        success: false, 
        code: 400,
        message: "Time não deletado"
      }
    }

    return { 
        success: true, 
        data: team
      };
  }

  async getTasksTeamById(id: string): Promise<Result<any, any>> {
    const tasks = await prisma.task.findMany({
      where: {
        teams: {
          some: {
            id
          }
        }
      },
      include: {
        teams: true
      }
    });

    if (!tasks || tasks.length === 0) {
      return {
        success: false,
        code: 404,
        message: "Nenhuma tarefa encontrada para este time"
      };
    }

    return {
      success: true,
      data: tasks
    };
  }
}
