import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const listRolesSchema = z.object({
    ...baseListSchema.shape,
});

export type ListRolesParams = z.infer<typeof listRolesSchema>;
