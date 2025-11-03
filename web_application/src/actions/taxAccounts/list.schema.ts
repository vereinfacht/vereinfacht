import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';
import { queryFilterSchema } from '../receipts/list.schema';

export const listTaxAccountsSchema = z.object({
    ...baseListSchema.shape,
    filter: z
        .object({
            query: queryFilterSchema,
        })
        .optional(),
});

export type ListTaxAccountsParams = z.infer<typeof listTaxAccountsSchema>;
