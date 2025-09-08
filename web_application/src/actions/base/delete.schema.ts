import { z } from 'zod';
import { idSchema } from './get.schema';

export const baseDeleteSchema = z.object({
    id: idSchema,
});

export type DeleteParams = z.infer<typeof baseDeleteSchema>;
