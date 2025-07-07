import { z } from 'zod';
import {
    financeAccountAttributesSchema,
    financeAccountRelationshipsSchema,
} from './base.schema';

export const createFinanceAccountSchema = z.object({
    data: z.object({
        type: z.literal('finance-accounts'),
        attributes: financeAccountAttributesSchema,
        relationships: financeAccountRelationshipsSchema,
    }),
});

export type CreateFinanceAccountParams = z.infer<
    typeof createFinanceAccountSchema
>;
