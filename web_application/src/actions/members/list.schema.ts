import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const queryFilterSchema = z.string().optional();
export const memberStatusOptions = ['active', 'inactive'] as const;
export const memberHasMediaOptions = ['true', 'false'] as const;
export const memberSortingOptions = [
    'fullName',
    '-fullName',
    'city',
    '-city',
] as const;

export const listMembersSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(memberSortingOptions)).optional(),
    filter: z
        .object({
            status: z.array(z.enum(memberStatusOptions)).optional(),
            media: z.boolean().optional(),
            membershipId: z.string().optional(),
        })
        .optional(),
});

export type ListMembersParams = z.infer<typeof listMembersSchema>;
