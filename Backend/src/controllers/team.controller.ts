import { Request, Response } from 'express';
import { TeamService } from '../services/team.service';

const teamService = new TeamService();

export class TeamController {
  async create(req: Request, res: Response) {
    try {
      const { name, colorHex, description } = req.body;

      if (!name || !colorHex) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: "The 'name' and 'colorHex' fields are required.",
          },
        });
      }

      const team = await teamService.createTeam({ name, colorHex, description });
      
      return res.status(201).json({ data: team });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error creating team' },
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      const search = req.query.search ? (req.query.search as string) : undefined;

      const result = await teamService.getTeams(limit, offset, search);

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error searching for teams' },
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const team = await teamService.getById(id) || [];

      return res.status(200).json({ data: team });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro updating team' },
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { name, colorHex, description } = req.body;

      const team = await teamService.updateTeam(id, { name, colorHex, description });
      return res.status(200).json({ data: team });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro updating team' },
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await teamService.deleteTeam(id);
      
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro deleting team' },
      });
    }
  }
}
