import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'O título precisa ter no mínimo 3 letras'),
  description: z.string().optional(),
  status: z.enum(['Pendente', 'Em Progresso', 'Concluída']).default('Pendente'),
  dueDate: z.coerce.date().optional(), 
  teamIds: z.array(z.string().uuid('ID de time inválido')).optional(), 
});

export const createTeamSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter no mínimo 3 letras'),
  colorHex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Formato de cor inválido. Use hex (ex: #FFFFFF)'),
  description: z.string().optional(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type CreateTeamDTO = z.infer<typeof createTeamSchema>;