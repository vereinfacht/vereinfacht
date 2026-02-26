import { z } from 'zod';
import { SupportedLocale, supportedLocales } from '@/utils/localization';

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
        monthlyFee: z
            .number()
            .min(0)
            .or(z.string().transform((value) => parseFloat(value))),
        admissionFee: z
            .union([
                z.number().min(0),
                z
                    .string()
                    .transform((value) => (value ? parseFloat(value) : null)),
            ])
            .optional(),
        minimumNumberOfMonths: z
            .number()
            .min(0)
            .max(24)
            .or(z.string().transform((value) => parseInt(value))),
        minimumNumberOfMembers: z
            .number()
            .min(1)
            .or(z.string().transform((value) => parseInt(value))),
        maximumNumberOfMembers: z
            .number()
            .min(1)
            .or(z.string().transform((value) => parseInt(value))),
    })
    .refine(
        (data) => data.minimumNumberOfMembers <= data.maximumNumberOfMembers,
        {
            message:
                'Minimum number of members must be less than or equal to maximum number of members.',
            path: ['minimumNumberOfMembers'],
        },
    )
    .refine(
        (data) => data.maximumNumberOfMembers >= data.minimumNumberOfMembers,
        {
            message:
                'Maximum number of members must be greater than or equal to minimum number of members.',
            path: ['maximumNumberOfMembers'],
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
