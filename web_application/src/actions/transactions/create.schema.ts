import { z } from 'zod';

export const transactionAttributesSchema = z.object({
    name: z.string().min(3).max(255).optional(),
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
});

export const createTransactionSchema = z.object({
    data: z.object({
        type: z.literal('transactions'),
        attributes: transactionAttributesSchema,
        relationships: transactionRelationshipsSchema,
    }),
});

export type CreateTransactionParams = z.infer<typeof createTransactionSchema>;
