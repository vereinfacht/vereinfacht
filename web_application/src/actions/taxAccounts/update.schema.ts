import { z } from 'zod';
import { idSchema } from '../base/base.schema';
import { taxAccountAttributesSchema } from './create.schema';

export const updateTaxAccountSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('tax-accounts'),
        attributes: taxAccountAttributesSchema,
    }),
});

export type UpdateTaxAccountParams = z.infer<typeof updateTaxAccountSchema>;
