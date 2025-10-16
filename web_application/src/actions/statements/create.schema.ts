import { z } from 'zod';

export const statementAttributesSchema = z.object({
    identifier: z.string().min(3).max(255).optional(),
    date: z.string(),
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
    transactions: z
        .object({
            data: z.array(
                z.object({
                    id: z.string(),
                    type: z.literal('transactions'),
                }),
            ),
        })
        .optional(),
});

export const createStatementSchema = z.object({
    data: z.object({
        type: z.literal('statements'),
        attributes: statementAttributesSchema,
        relationships: statementRelationshipsSchema,
    }),
});

export type CreateStatementParams = z.infer<typeof createStatementSchema>;
