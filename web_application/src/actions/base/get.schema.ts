import { z } from 'zod';

export const idSchema = z.string().min(1, 'ID is required');

export const baseGetSchema = z.object({
    id: idSchema,
});
