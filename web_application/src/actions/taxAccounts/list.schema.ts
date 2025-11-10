import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';
import { queryFilterSchema } from '../receipts/list.schema';

export const taxAccountSortingOptions = [
    'accountNumber',
    '-accountNumber',
    'description',
    '-description',
] as const;

export const listTaxAccountsSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(taxAccountSortingOptions)).optional(),
    filter: z
        .object({
            query: queryFilterSchema,
            taxAccountChart: z.boolean().optional(),
        })
        .optional(),
});

export type ListTaxAccountsParams = z.infer<typeof listTaxAccountsSchema>;
