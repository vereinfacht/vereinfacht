import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import { accountTypes, financeAccountAttributesSchema } from './create.schema';

export const updateFinanceAccountSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('finance-accounts'),
        attributes: z.object({
            ...financeAccountAttributesSchema.shape,
            title: z.string().min(2).max(100).optional(),
            accountType: z.enum(accountTypes).optional(),
            deletedAt: z
                .string()
                .optional()
                .transform((val) => (val === undefined ? null : val)),
        }),
    }),
});

export type UpdateFinanceAccountParams = z.infer<
    typeof updateFinanceAccountSchema
>;
