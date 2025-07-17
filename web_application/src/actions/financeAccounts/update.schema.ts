import { z } from 'zod';

export const updateFinanceAccountSchema = z.object({
    id: z.string().min(1, 'Finance account ID is required'),
    data: z.object({
        type: z.literal('finance-accounts'),
        id: z.string().min(1),
        attributes: z.object({}).optional(),
        relationships: z.object({}).optional(),
    }),
});

export type UpdateFinanceAccountParams = z.infer<
    typeof updateFinanceAccountSchema
>;
