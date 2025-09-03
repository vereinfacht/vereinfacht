import { z } from 'zod';
import { createFinanceContactSchema } from './create.schema';
import { idSchema } from '../base/get.schema';

export const genderOptions = ['other', 'male', 'female'] as const;

export const updateFinanceContactSchema = createFinanceContactSchema.extend({
    data: createFinanceContactSchema.shape.data.extend({
        id: idSchema,
    }),
});

export type UpdateFinanceContactParams = z.infer<
    typeof updateFinanceContactSchema
>;
