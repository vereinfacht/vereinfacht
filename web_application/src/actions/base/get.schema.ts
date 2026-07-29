import { z } from 'zod';
import { idSchema } from './base.schema';

export const baseGetSchema = z.object({
    id: idSchema,
    include: z.array(z.string()).optional(),
});
