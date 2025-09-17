import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import { financeContactAttributesSchema } from './create.schema';

export const genderOptions = ['other', 'male', 'female'] as const;

export const updateFinanceContactSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('finance-contacts'),
        attributes: financeContactAttributesSchema,
    }),
});

export type UpdateFinanceContactParams = z.infer<
    typeof updateFinanceContactSchema
>;
