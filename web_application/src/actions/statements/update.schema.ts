import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import { statementAttributesSchema } from './create.schema';

export const updateStatementSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('statements'),
        attributes: statementAttributesSchema,
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
        }),
    }),
});

export type UpdateStatementParams = z.infer<typeof updateStatementSchema>;
