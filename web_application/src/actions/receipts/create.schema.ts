import { z } from 'zod';

export const receiptType = ['income', 'expense'] as const;

export const createReceiptSchema = z.object({
    data: z.object({
        type: z.literal('receipts'),
        attributes: z.object({
            receiptType: z.enum(receiptType),
            referenceNumber: z.string().min(2).max(255),
            documentDate: z.string(),
            amount: z.string(),
        }),
        relationships: z.object({
            club: z.object({
                data: z.object({
                    id: z.string(),
                    type: z.literal('clubs'),
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
        }),
    }),
});

export type CreateReceiptParams = z.infer<typeof createReceiptSchema>;
