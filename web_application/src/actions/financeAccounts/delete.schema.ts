import { z } from 'zod';

export const deleteFinanceAccountSchema = z.object({
    id: z.string().min(1, 'Finance Account ID is required'),
});

export type DeleteFinanceAccountParams = z.infer<
    typeof deleteFinanceAccountSchema
>;
