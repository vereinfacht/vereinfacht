import { z } from 'zod';

export const amountSchema = z
    .string()
    .refine((value) => !isNaN(Number(value)), {
        message: 'Amount must be a number',
    })
    .refine((value) => Number(value) !== 0, {
        message: 'Amount must not be zero',
    });

export const statementAttributesSchema = z.object({
    date: z.string(),
    transactionAmount: amountSchema,
    title: z.string().min(1).max(255),
    description: z.string().max(1000),
});

export const statementRelationshipsSchema = z.object({
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

export const createStatementSchema = z.object({
    data: z.object({
        type: z.literal('statements'),
        attributes: statementAttributesSchema,
        relationships: statementRelationshipsSchema,
    }),
});

export type CreateStatementParams = z.infer<typeof createStatementSchema>;
