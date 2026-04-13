import { z } from 'zod';

export const updateDivisionMembershipTypeSchema = z.object({
    data: z.object({
        type: z.literal('division-membership-types'),
        id: z.string(),
        attributes: z.object({
            monthlyFee: z.coerce.number().min(0),
        }),
        relationships: z.object({
            division: z.object({
                data: z.object({
                    type: z.literal('divisions'),
                    id: z.string(),
                }),
            }),
            membershipType: z.object({
                data: z.object({
                    type: z.literal('membership-types'),
                    id: z.string(),
                }),
            }),
        }),
    }),
});

export type UpdateDivisionMembershipTypeParams = z.infer<
    typeof updateDivisionMembershipTypeSchema
>;
