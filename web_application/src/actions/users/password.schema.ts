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
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(255)
            .regex(
                /[a-z]/,
                'Password must contain at least one lowercase letter',
            )
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter',
            )
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(
                /[^a-zA-Z0-9]/,
                'Password must contain at least one special character',
            ),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        path: ['password_confirmation'],
        message: 'Passwords do not match.',
    });
