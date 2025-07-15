import { z } from 'zod';

export const membershipStatusOptions = [
    'applied',
    'active',
    'cancelled',
] as const;

export const listMembershipsSortingOptions = [
    'createdAt',
    '-createdAt',
    'startedAt',
    '-startedAt',
] as const;

export const listMembershipsSchema = z.object({
    // Sorting parameters
    sort: z.array(z.enum(listMembershipsSortingOptions)).optional(),
});

export type ListMembershipsParams = z.infer<typeof listMembershipsSchema>;
