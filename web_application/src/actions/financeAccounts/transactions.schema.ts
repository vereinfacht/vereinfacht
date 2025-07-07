import { z } from 'zod';

export const getAccountTransactionsSchema = z.object({
    financeAccountId: z.string().min(1, 'Finance Account ID is required'),
    // Optional pagination parameters
    page: z
        .object({
            size: z.number().int().positive().optional(),
            number: z.number().int().positive().optional(),
        })
        .optional(),
    // Optional sorting parameters
    sort: z
        .array(
            z.enum([
                'id',
                '-id',
                'valuedAt',
                '-valuedAt',
                'bookedAt',
                '-bookedAt',
                'createdAt',
                '-createdAt',
                'updatedAt',
                '-updatedAt',
            ]),
        )
        .optional(),
    // Optional filter parameters
    filter: z
        .object({
            id: z.array(z.string()).optional(),
        })
        .optional(),
});

export type GetAccountTransactionsParams = z.infer<
    typeof getAccountTransactionsSchema
>;
