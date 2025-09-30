import { z } from 'zod';

export const transactionAttributesSchema = z.object({
    name: z.string().min(3).max(255).optional(),
    description: z.string().optional(),
    bookedAt: z.string(),
    amount: z
        .string()
        .refine((value) => !isNaN(Number(value)), {
            message: 'Amount must be a number',
        })
        .refine((value) => Number(value) !== 0, {
            message: 'Amount must not be zero',
        }),
});

export const transactionRelationshipsSchema = z.object({
    club: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('clubs'),
        }),
    }),
    financeAccount: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('finance-accounts'),
        }),
    }),
    receipts: z
        .object({
            data: z.array(
                z.object({
                    id: z.string(),
                    type: z.literal('receipts'),
                }),
            ),
        })
        .optional(),
});

export const createTransactionSchema = z.object({
    data: z.object({
        type: z.literal('transactions'),
        attributes: transactionAttributesSchema,
        relationships: transactionRelationshipsSchema,
    }),
});

export type CreateTransactionParams = z.infer<typeof createTransactionSchema>;
