import { z } from 'zod';

export const forgotPasswordSchema = z.object({
    email: z.email(),
});

export const resetPasswordSchema = z
    .object({
        token: z
            .string()
            .length(64, 'Token must be exactly 64 characters')
            .regex(
                /^[a-f0-9]+$/i,
                'Token contains invalid characters (must be valid hex)',
            ),
        email: z.email(),
        password: z.string().min(8).max(255),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        path: ['password_confirmation'],
        message: 'Passwords do not match.',
    });
