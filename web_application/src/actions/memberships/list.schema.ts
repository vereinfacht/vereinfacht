import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const membershipStatusOptions = [
    'applied',
    'active',
    'cancelled',
] as const;

export const membershipSortingOptions = [
    'createdAt',
    '-createdAt',
    'startedAt',
    '-startedAt',
] as const;

export const listMembershipsSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(membershipSortingOptions)).optional(),
    filter: z
        .object({
            status: z.array(z.enum(membershipStatusOptions)).optional(),
            query: z.string().optional(),
        })
        .optional(),
});

export type ListMembershipsParams = z.infer<typeof listMembershipsSchema>;
