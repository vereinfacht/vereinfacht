import { SupportedLocale, supportedLocales } from '@/utils/localization';
import { z } from 'zod';

export const translationSchema = z
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

export const membershipTypeAttributesSchema = z
    .object({
        titleTranslations: translationSchema,
        descriptionTranslations: translationSchema,
        monthlyFee: z.coerce.number().min(0),
        admissionFee: z.coerce.number().min(0).nullable().optional(),
        minimumNumberOfMonths: z.coerce.number().min(0).max(24),
        minimumNumberOfMembers: z.coerce.number().min(1),
        maximumNumberOfMembers: z.coerce.number().min(1),
        minimumNumberOfDivisions: z.preprocess(
            (value) => (value === '' || value === undefined ? null : value),
            z.coerce.number().int().min(0).nullable(),
        ),
        maximumNumberOfDivisions: z.preprocess(
            (value) => (value === '' || value === undefined ? null : value),
            z.coerce.number().int().min(0).nullable(),
        ),
    })
    .refine(
        (data) => data.minimumNumberOfMembers <= data.maximumNumberOfMembers,
        {
            message:
                'Die Mindestanzahl an Mitgliedern muss kleiner oder gleich der Maximalanzahl an Mitgliedern sein.',
            path: ['minimumNumberOfMembers'],
        },
    )
    .refine(
        (data) => data.maximumNumberOfMembers >= data.minimumNumberOfMembers,
        {
            message:
                'Die Maximalanzahl an Mitgliedern muss größer oder gleich der Mindestanzahl an Mitgliedern sein.',
            path: ['maximumNumberOfMembers'],
        },
    )
    .refine(
        (data) =>
            data.minimumNumberOfDivisions === null ||
            data.minimumNumberOfDivisions === undefined ||
            data.maximumNumberOfDivisions === null ||
            data.maximumNumberOfDivisions === undefined ||
            data.minimumNumberOfDivisions <= data.maximumNumberOfDivisions,
        {
            message:
                'Die Mindestanzahl an Sparten muss kleiner oder gleich der Maximalanzahl an Sparten sein.',
            path: ['minimumNumberOfDivisions'],
        },
    )
    .refine(
        (data) =>
            data.maximumNumberOfDivisions === null ||
            data.maximumNumberOfDivisions === undefined ||
            data.minimumNumberOfDivisions === null ||
            data.minimumNumberOfDivisions === undefined ||
            data.maximumNumberOfDivisions >= data.minimumNumberOfDivisions,
        {
            message:
                'Die Maximalanzahl an Sparten muss größer oder gleich der Mindestanzahl an Sparten sein.',
            path: ['maximumNumberOfDivisions'],
        },
    );

export const membershipTypeRelationshipsSchema = z.object({
    club: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('clubs'),
        }),
    }),
});

export const createMembershipTypeSchema = z.object({
    data: z.object({
        type: z.literal('membership-types'),
        attributes: membershipTypeAttributesSchema,
        relationships: membershipTypeRelationshipsSchema,
    }),
});

export type CreateMembershipTypeParams = z.infer<
    typeof createMembershipTypeSchema
>;
