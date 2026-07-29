import z from 'zod';

export const idSchema = z.string().min(1, 'ID is required');

export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255)
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
        /[^a-zA-Z0-9]/,
        'Password must contain at least one special character',
    );
