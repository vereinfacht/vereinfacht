import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const permissionSortingOptions = ['name', '-name'] as const;

export const listPermissionsSchema = baseListSchema.extend({
    sort: z.array(z.enum(permissionSortingOptions)).optional(),
});

export type ListPermissionsParams = z.infer<typeof listPermissionsSchema>;
