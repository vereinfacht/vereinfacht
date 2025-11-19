import { z } from 'zod';
import { receiptAttributesSchema } from './create.schema';
import { idSchema } from '../base/get.schema';

export const updateReceiptSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('receipts'),
        attributes: receiptAttributesSchema,
        relationships: z.object({
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
                        z
                            .object({
                                id: z.string(),
                                type: z.literal('transactions'),
                            })
                            .nullable(),
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
            taxAccount: z
                .object({
                    data: z
                        .object({
                            id: z.string(),
                            type: z.literal('tax-accounts'),
                        })
                        .nullable(),
                })
                .optional(),
        }),
    }),
});

export type UpdateReceiptParams = z.infer<typeof updateReceiptSchema>;
