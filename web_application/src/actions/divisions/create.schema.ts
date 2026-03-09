import { z } from 'zod';
import { translationSchema } from '../membershipTypes/create.schema';

export const divisionAttributesSchema = z.object({
    titleTranslations: translationSchema,
});

export const divisionRelationshipsSchema = z.object({
    club: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('clubs'),
        }),
    }),
});

export const createDivisionSchema = z.object({
    data: z.object({
        type: z.literal('divisions'),
        attributes: divisionAttributesSchema,
        relationships: divisionRelationshipsSchema,
    }),
});

export type CreateDivisionParams = z.infer<typeof createDivisionSchema>;
