import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const membershipTypeSortingOptions = ['title', '-title'] as const;

export const listMembershipTypesSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(membershipTypeSortingOptions)).optional(),
    filter: z
        .object({
            query: z.string().optional(),
        })
        .optional(),
});

export type ListMembershipTypesParams = z.infer<
    typeof listMembershipTypesSchema
>;
