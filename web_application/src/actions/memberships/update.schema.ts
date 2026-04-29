import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import {
    membershipAttributesSchema,
    membershipDateRefinement,
    membershipRelationshipsSchema,
    membershipStatus,
} from './create.schema';

export const updateMembershipSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('memberships'),
        attributes: membershipAttributesSchema
            .extend({ status: z.enum(membershipStatus).optional() })
            .superRefine(membershipDateRefinement),
        relationships: membershipRelationshipsSchema
            .omit({ club: true })
            .partial()
            .optional(),
    }),
});

export type UpdateMembershipParams = z.infer<typeof updateMembershipSchema>;
