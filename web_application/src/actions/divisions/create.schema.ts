import { z } from 'zod';
import { SupportedLocale, supportedLocales } from '@/utils/localization';

const divisionTranslationSchema = z.object(
    supportedLocales.reduce(
        (acc, locale) => {
            acc[locale] = z.optional(
                z
                    .string()
                    .min(2, 'Minimum 2 characters required')
                    .max(255)
                    .or(z.literal('')),
            );
            return acc;
        },
        {} as Record<
            SupportedLocale,
            z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<''>]>>
        >,
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
    membershipTypes: z
        .object({
            data: z.array(
                z.object({
                    id: z.string(),
                    type: z.literal('membership-types'),
                }),
            ),
        })
        .optional(),
});

export const createDivisionSchema = z.object({
    data: z.object({
        type: z.literal('divisions'),
        attributes: divisionAttributesSchema,
        relationships: divisionRelationshipsSchema,
    }),
});

export type CreateDivisionParams = z.infer<typeof createDivisionSchema>;
