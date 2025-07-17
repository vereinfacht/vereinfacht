import { z } from 'zod';

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
    sort: z.array(z.enum(membershipSortingOptions)).optional(),
});

export type ListMembershipsParams = z.infer<typeof listMembershipsSchema>;
