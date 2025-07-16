import { z } from 'zod';

export const getFinanceContactSchema = z.object({
    id: z.string().min(1, 'Finance Contact ID is required'),
});

export type GetFinanceContactParams = z.infer<typeof getFinanceContactSchema>;
