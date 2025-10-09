import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const accountTypeOptions = ['bank_account', 'cash_box'] as const;

export const listFinanceAccountsSchema = z.object({
    ...baseListSchema.shape,
    filter: z
        .object({
            'with-trashed': z.boolean().optional(),
            accountType: z.enum(accountTypeOptions).optional(),
        })
        .optional(),
});

export type ListFinanceAccountsParams = z.infer<
    typeof listFinanceAccountsSchema
>;
