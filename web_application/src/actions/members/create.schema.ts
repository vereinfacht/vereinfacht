import { z } from 'zod';

const genderOptions = ['other', 'male', 'female'] as const;

export const memberAttributesSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    gender: z.enum(genderOptions).optional(),
    address: z.string().min(2).max(255).optional(),
    zipCode: z.string().min(1).max(255),
    city: z.string().min(1).max(255),
    country: z.string().min(1).max(255),
    preferredLocale: z.string().min(2).max(10).optional(),
    birthday: z.string().optional(),
    phoneNumber: z.string().min(2).max(255).optional(),
    status: z.enum(['active', 'inactive']),
    hasConsentedMediaPublication: z.coerce.boolean().optional(),
});

export const memberRelationshipsSchema = z.object({
    club: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('clubs'),
        }),
    }),
    media: z
        .object({
            data: z.array(
                z.object({
                    id: z.string(),
                    type: z.literal('media'),
                }),
            ),
        })
        .optional(),
    membership: z
        .object({
            data: z.object({
                id: z.string(),
                type: z.literal('memberships'),
            }),
        })
        .optional(),
    divisions: z
        .object({
            data: z.array(
                z.object({
                    id: z.string(),
                    type: z.literal('divisions'),
                }),
            ),
        })
        .optional(),
});

export const createMemberSchema = z.object({
    data: z.object({
        type: z.literal('members'),
        attributes: memberAttributesSchema,
        relationships: memberRelationshipsSchema.optional(),
    }),
});

export type CreateMemberParams = z.infer<typeof createMemberSchema>;
