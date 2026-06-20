import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.post('/', taskController.create.bind(taskController));
taskRoutes.get('/', taskController.getAll.bind(taskController));
taskRoutes.get('/:id', taskController.getById.bind(taskController));
taskRoutes.put('/:id', taskController.update.bind(taskController));
taskRoutes.delete('/:id', taskController.delete.bind(taskController));
taskRoutes.delete('/:taskId/teams/:teamId', taskController.deleteTeamTask.bind(taskController));

export { taskRoutes };