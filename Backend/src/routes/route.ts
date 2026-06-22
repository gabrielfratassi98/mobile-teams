import { Router } from 'express';
import { teamRoutes } from './team-route';
import { taskRoutes } from './task.route';

const routes = Router();

routes.use('/teams', teamRoutes);
routes.use('/tasks', taskRoutes);

export { routes };