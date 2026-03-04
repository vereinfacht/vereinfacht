import { z } from 'zod';

export const divisionMembershipTypeAttributesSchema = z.object({
    monthlyFee: z.coerce.number().min(0),
});

export const divisionMembershipTypeRelationshipsSchema = z.object({
    division: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('divisions'),
        }),
    }),
    membershipType: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('membership-types'),
        }),
    }),
});

export const createDivisionMembershipTypeSchema = z.object({
    data: z.object({
        type: z.literal('division-membership-types'),
        attributes: divisionMembershipTypeAttributesSchema,
        relationships: divisionMembershipTypeRelationshipsSchema,
    }),
});

export type CreateDivisionMembershipTypeParams = z.infer<
    typeof createDivisionMembershipTypeSchema
>;
