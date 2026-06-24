import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 letras'),
  colorHex: z.string(),
  description: z.string().optional(),
});

export type CreateTeamDTO = z.infer<typeof createTeamSchema>;

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 letras'),
  description: z.string().optional(),
  status: z.enum(['Pendente', 'Em Progresso', 'Concluída']).default('Pendente'),
  dueDate: z.date().optional(),
  teamIds: z.array(z.string()).optional(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;