import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const listRolesSchema = z.object({
    ...baseListSchema.shape,
    filter: z
        .object({
            query: z.string().optional(),
        })
        .optional(),
});

export type ListRolesParams = z.infer<typeof listRolesSchema>;
