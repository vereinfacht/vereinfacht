import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';
import { queryFilterSchema } from '../receipts/list.schema';

export const financeContactSortingOptions = [
    'fullName',
    '-fullName',
    'companyName',
    '-companyName',
    'city',
    '-city',
] as const;

export const financeContactTypeOptions = ['person', 'company'] as const;

export const listFinanceContactsSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(financeContactSortingOptions)).optional(),
    filter: z
        .object({
            contactType: z.array(z.enum(financeContactTypeOptions)).optional(),
            query: queryFilterSchema,
        })
        .optional(),
});

export type ListFinanceContactsParams = z.infer<
    typeof listFinanceContactsSchema
>;
