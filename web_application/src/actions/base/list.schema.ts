import { z } from 'zod';

export const baseListSchema = z.object({
    page: z
        .object({
            size: z.int().positive().optional(),
            number: z.int().positive().optional(),
        })
        .optional(),
    sort: z.array(z.enum(['createdAt', '-createdAt'] as const)).optional(),
    include: z.array(z.string()).optional(),
    fields: z.record(z.string(), z.array(z.string()).optional()).optional(),
});
