import { z } from 'zod';
import { SupportedLocale, supportedLocales } from '@/utils/localization';

const divisionTranslationSchema = z.object(
    supportedLocales.reduce(
        (acc, locale) => {
            acc[locale] = z.string().min(2).max(255);
            return acc;
        },
        {} as Record<SupportedLocale, z.ZodString>,
    ),
);

export const divisionAttributesSchema = z.object({
    titleTranslations: divisionTranslationSchema,
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
