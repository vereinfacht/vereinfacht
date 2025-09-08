import { z } from 'zod';

export const receiptType = ['income', 'expense'] as const;

export const createReceiptSchema = z.object({
    data: z.object({
        type: z.literal('receipts'),
        attributes: z.object({
            receiptType: z.enum(receiptType),
            referenceNumber: z.string().min(2).max(255).optional(),
            documentDate: z.date(),
            amount: z.number(),
        }),
        relationships: z.object({
            club: z.object({
                data: z.object({
                    id: z.string(),
                    type: z.literal('clubs'),
                }),
            }),
        }),
    }),
});

export type CreateReceiptParams = z.infer<typeof createReceiptSchema>;
