import { z } from 'zod';

export const createDivisionMembershipTypeSchema = z.object({
    data: z.object({
        type: z.literal('division-membership-types'),
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

export type CreateDivisionMembershipTypeParams = z.infer<
    typeof createDivisionMembershipTypeSchema
>;
