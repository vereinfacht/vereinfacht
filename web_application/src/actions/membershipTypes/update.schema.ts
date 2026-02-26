import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import {
    membershipTypeAttributesSchema,
    membershipTypeRelationshipsSchema,
} from './create.schema';

export const updateMembershipTypeSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('membership-types'),
        attributes: membershipTypeAttributesSchema,
        relationships: membershipTypeRelationshipsSchema.partial().optional(),
    }),
});

export type UpdateMembershipTypeParams = z.infer<
    typeof updateMembershipTypeSchema
>;
