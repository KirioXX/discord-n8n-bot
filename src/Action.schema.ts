import { z } from 'zod';

export const ActionResponseSchema = z.object({
  answer: z.string(),
});

export type ActionResponse = z.infer<typeof ActionResponseSchema>;
