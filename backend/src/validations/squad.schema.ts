import { z } from 'zod';
import { idSchema } from './common.schema';

export const joinSquadSchema = {
  params: z.object({
    squadId: idSchema.shape.id,
  }),
};
