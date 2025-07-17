import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const transactionSortingOptions = [
    'bookedAt',
    '-bookedAt',
    'valuedAt',
    '-valuedAt',
    'amount',
    '-amount',
] as const;

export const listTransactionsSchema = baseListSchema.extend({
    sort: z.array(z.enum(transactionSortingOptions)).optional(),
    filter: z
        .object({
            financeAccountId: z.string().optional(),
        })
        .optional(),
});

export type ListTransactionsParams = z.infer<typeof listTransactionsSchema>;
