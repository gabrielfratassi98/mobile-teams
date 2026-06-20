import { prisma } from '../server.js';

export class TeamService {
  async createTeam(data: { name: string; colorHex: string; description?: string }) {
    return await prisma.team.create({
      data,
    });
  }

  async getTeams(limit: number = 10, offset: number = 0, search?: string) {
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

    return {
      data,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }

  async getById(id: string) {
    return await prisma.team.findFirst({
      where: { id }
    });
  }

  async updateTeam(id: string, data: { name?: string; colorHex?: string; description?: string }) {
    return await prisma.team.update({
      where: { id },
      data,
    });
  }

  async deleteTeam(id: string) {
    return await prisma.team.delete({
      where: { id },
    });
  }
}