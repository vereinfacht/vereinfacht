import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const listFinanceAccountsSchema = baseListSchema.extend({
    filter: z
        .object({
            'with-trashed': z.boolean().optional(),
        })
        .optional(),
});

export type ListFinanceAccountsParams = z.infer<
    typeof listFinanceAccountsSchema
>;
