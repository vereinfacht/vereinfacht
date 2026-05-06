import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import {
    memberAttributesSchema,
    memberRelationshipsSchema,
} from './create.schema';

export const updateMemberSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('members'),
        attributes: memberAttributesSchema,
        relationships: memberRelationshipsSchema.partial().optional(),
    }),
});

export type UpdateMemberParams = z.infer<typeof updateMemberSchema>;
