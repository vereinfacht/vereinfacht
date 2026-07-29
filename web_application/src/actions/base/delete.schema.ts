import { z } from 'zod';
import { idSchema } from './base.schema';

export const baseDeleteSchema = z.object({
    id: idSchema,
});

export type DeleteParams = z.infer<typeof baseDeleteSchema>;
