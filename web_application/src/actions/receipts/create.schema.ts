import { z } from 'zod';

export const receiptType = ['income', 'expense'] as const;

export const receiptAttributesSchema = z.object({
    receiptType: z.enum(receiptType),
    referenceNumber: z.string().min(2).max(255).optional(),
    documentDate: z.string(),
    amount: z
        .string()
        .refine((value) => !isNaN(Number(value)), {
            message: 'Amount must be a number',
        })
        .refine((value) => Number(value) !== 0, {
            message: 'Amount must not be zero',
        }),
});

export const receiptRelationshipsSchema = z.object({
    club: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('clubs'),
        }),
    }),
    financeContact: z
        .object({
            data: z
                .object({
                    id: z.string(),
                    type: z.literal('finance-contacts'),
                })
                .nullable(),
        })
        .optional(),
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
    media: z
        .object({
            data: z.array(
                z.object({
                    id: z.string(),
                    type: z.literal('media'),
                }),
            ),
        })
        .optional(),
});

export const createReceiptSchema = z.object({
    data: z.object({
        type: z.literal('receipts'),
        attributes: receiptAttributesSchema,
        relationships: receiptRelationshipsSchema,
    }),
});

export type CreateReceiptParams = z.infer<typeof createReceiptSchema>;
