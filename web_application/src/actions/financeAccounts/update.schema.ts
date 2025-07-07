import { z } from 'zod';
import {
    financeAccountAttributesSchema,
    financeAccountRelationshipsSchema,
} from './base.schema';

export const updateFinanceAccountSchema = z.object({
    id: z.string().min(1, 'Finance Account ID is required'),
    data: z.object({
        type: z.literal('finance-accounts'),
        id: z.string().min(1),
        attributes: financeAccountAttributesSchema.partial(),
        relationships: financeAccountRelationshipsSchema,
    }),
});

export type UpdateFinanceAccountParams = z.infer<
    typeof updateFinanceAccountSchema
>;
