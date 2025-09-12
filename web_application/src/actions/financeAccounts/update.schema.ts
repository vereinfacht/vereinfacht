import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import {
    accountTypes,
    createFinanceAccountSchema,
    extendZodEffects,
    financeAccountAttributesSchema,
} from './create.schema';

export const updateFinanceAccountSchema = z.object({
    data: createFinanceAccountSchema.shape.data.extend({
        id: idSchema,
        type: z.literal('finance-accounts'),
        attributes: extendZodEffects(
            financeAccountAttributesSchema,
            z.object({
                accountType: z.enum(accountTypes).optional(),
                deletedAt: z
                    .string()
                    .optional()
                    .transform((val) => (val === undefined ? null : val)),
            }),
        ),
    }),
});

export type UpdateFinanceAccountParams = z.infer<
    typeof updateFinanceAccountSchema
>;
