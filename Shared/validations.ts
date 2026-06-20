import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'O título precisa ter no mínimo 3 letras'),
  description: z.string().optional(),
  status: z.enum(['Pendente', 'Em Progresso', 'Concluída']).default('Pendente'),
  teamIds: z.array(z.number()).optional(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;