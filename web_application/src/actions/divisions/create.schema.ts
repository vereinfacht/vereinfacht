import { z } from 'zod';
import { SupportedLocale, supportedLocales } from '@/utils/localization';

const divisionTranslationSchema = z
    .object(
        supportedLocales.reduce(
            (acc, locale) => {
                acc[locale] = z.string().min(2).optional().or(z.literal(''));
                return acc;
            },
            {} as Record<SupportedLocale, z.ZodTypeAny>,
        ),
    )
    .refine(
        (data) => {
            return Object.values(data).some(
                (value) => typeof value === 'string' && value.length >= 2,
            );
        },
        {
            message: 'Mindestens eine Sprache muss ausgefüllt sein.',
        },
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
