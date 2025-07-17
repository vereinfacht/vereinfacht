import { z } from 'zod';

export const createFinanceAccountSchema = z.object({
    data: z.object({
        type: z.literal('finance-accounts'),
        attributes: z.object({}).optional(),
        relationships: z.object({}).optional(),
    }),
});

export type CreateFinanceAccountParams = z.infer<
    typeof createFinanceAccountSchema
>;
