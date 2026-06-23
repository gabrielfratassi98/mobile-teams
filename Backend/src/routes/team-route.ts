import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';

const teamRoutes = Router();
const teamController = new TeamController();

teamRoutes.post('/', teamController.create.bind(teamController));
teamRoutes.get('/', teamController.getAll.bind(teamController));
teamRoutes.get('/:id', teamController.getById.bind(teamController));
teamRoutes.get('/:id/tasks', teamController.getTasksTeamById.bind(teamController));
teamRoutes.put('/:id', teamController.update.bind(teamController));
teamRoutes.delete('/:id', teamController.delete.bind(teamController));

export { teamRoutes };