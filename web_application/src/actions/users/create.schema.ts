import { z } from 'zod';

export const preferredLocale = ['de', 'en'] as const;

export const createUserSchema = z.object({
    data: z.object({
        type: z.literal('users'),
        attributes: z.object({
            name: z.string().min(2).max(255),
            email: z.string().email().max(255),
            password: z.string().min(8).max(255),
            preferredLocale: z.enum(preferredLocale),
        }),
    }),
});

export type CreateUserParams = z.infer<typeof createUserSchema>;
