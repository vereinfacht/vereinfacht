import { z } from 'zod';

export const preferredLocale = ['de', 'en'] as const;

export const userAttributesSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.email().max(255),
    password: z.string().min(8).max(255),
    preferredLocale: z.enum(preferredLocale),
});

export const userRelationshipsSchema = z.object({
    club: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('clubs'),
        }),
    }),
    permissions: z
        .object({
            data: z.array(
                z.object({
                    id: z.string(),
                    type: z.literal('permissions'),
                }),
            ),
        })
        .optional(),
});

export const createUserSchema = z.object({
    data: z.object({
        type: z.literal('users'),
        attributes: userAttributesSchema,
        relationships: userRelationshipsSchema,
    }),
});

export type CreateUserParams = z.infer<typeof createUserSchema>;
