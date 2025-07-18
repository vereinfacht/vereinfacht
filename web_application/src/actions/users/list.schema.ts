import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const userSortingOptions = ['name', '-name'] as const;

export const listUsersSchema = baseListSchema.extend({
    sort: z.array(z.enum(userSortingOptions)).optional(),
});

export type ListUsersParams = z.infer<typeof listUsersSchema>;
