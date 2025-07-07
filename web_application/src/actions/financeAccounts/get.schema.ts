import { z } from 'zod';

export const getFinanceAccountSchema = z.object({
    id: z.string().min(1, 'Finance Account ID is required'),
});

export type GetFinanceAccountParams = z.infer<typeof getFinanceAccountSchema>;
