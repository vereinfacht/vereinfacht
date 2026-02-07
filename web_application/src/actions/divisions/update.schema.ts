import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import {
    divisionAttributesSchema,
    divisionRelationshipsSchema,
} from './create.schema';

export const updateDivisionSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('divisions'),
        attributes: divisionAttributesSchema,
        relationships: divisionRelationshipsSchema.partial().optional(),
    }),
});

export type UpdateDivisionParams = z.infer<typeof updateDivisionSchema>;
