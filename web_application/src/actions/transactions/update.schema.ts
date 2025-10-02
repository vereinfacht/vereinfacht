import { z } from 'zod';
import { transactionAttributesSchema } from './create.schema';
import { idSchema } from '../base/get.schema';

export const updateTransactionSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('transactions'),
        attributes: transactionAttributesSchema,
        relationships: z.object({
            financeAccount: z
                .object({
                    data: z
                        .object({
                            id: z.string(),
                            type: z.literal('finance-accounts'),
                        })
                        .nullable(),
                })
                .optional(),
            receipts: z
                .object({
                    data: z.array(
                        z
                            .object({
                                id: z.string(),
                                type: z.literal('receipts'),
                            })
                            .nullable(),
                    ),
                })
                .optional(),
        }),
    }),
});

export type UpdateTransactionParams = z.infer<typeof updateTransactionSchema>;
