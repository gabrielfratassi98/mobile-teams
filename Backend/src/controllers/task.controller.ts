import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { createTaskSchema } from '../../../Shared/validations';

const taskService = new TaskService();

export class TaskController {
  async create(req: Request, res: Response) {
    try {
      const validation = createTaskSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: { 
            code: 'VALIDATION_ERROR', 
            message: validation.error.issues[0].message 
          },
        });
      }

      const { title, description, status, dueDate, teamIds } = req.body;
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;

      const result = await taskService.createTask({ 
        title, description, status, dueDate: parsedDueDate, teamIds 
      });
      
      if (!result.success) {
        return res.status(result.code || 400).json({
          error: {
            code: 'BAD_REQUEST',
            message: result.message,
          },
        });
      }

      return res.status(201).json({ 
        data: result.data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao criar a tarefa.' },
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset) || 0;
      
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const teamId = typeof req.query.teamId === 'string' ? req.query.teamId : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;

      const result = await taskService.getTasks(limit, offset, search, teamId, status, sort);

      if (!result.success) {
        return res.status(result.code || 400).json({
          error: {
            code: 'BAD_REQUEST',
            message: result.message,
          },
        });
      }

      return res.status(200).json({
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao buscar as tarefas.' },
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      
      const result = await taskService.getById(id);
      
      if (!result.success) {
        return res.status(result.code || 404).json({
          error: {
            code: 'NOT_FOUND',
            message: result.message,
          },
        });
      }

      return res.status(200).json({ 
        data: result.data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao buscar a tarefa.' },
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const validation = createTaskSchema.partial().safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: { 
            code: 'VALIDATION_ERROR', 
            message: validation.error.issues[0].message 
          },
        });
      }

      const id = String(req.params.id);
      
      const { title, description, status, dueDate, teamIds } = req.body;
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;

      const result = await taskService.updateTask(id, { 
        title, description, status, dueDate: parsedDueDate, teamIds 
      });
      
      if (!result.success) {
        return res.status(result.code || 400).json({
          error: {
            code: 'BAD_REQUEST',
            message: result.message,
          },
        });
      }

      return res.status(200).json({ 
        data: result.data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao atualizar a tarefa.' },
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      
      const result = await taskService.deleteTask(id);
      
      if (!result.success) {
        return res.status(result.code || 400).json({
          error: {
            code: 'BAD_REQUEST',
            message: result.message,
          },
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao deletar a tarefa.' },
      });
    }
  }

  async deleteTeamTask(req: Request, res: Response) {
    try {
      const taskId = String(req.params.taskId);
      const teamId = String(req.params.teamId);

      const result = await taskService.deleteTeamTask(taskId, teamId);
      
      if (!result.success) {
        return res.status(result.code || 400).json({
          error: {
            code: 'BAD_REQUEST',
            message: result.message,
          },
        });
      }

      return res.status(200).json({
        data: result.data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao deletar o vínculo da tarefa.' },
      });
    }
  }
}
