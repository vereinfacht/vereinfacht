import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const receiptSortingOptions = [
    'documentDate',
    '-documentDate',
    'amount',
    '-amount',
] as const;

export const receiptTypeOptions = ['income', 'expense'] as const;
export const receiptStatusOptions = ['incompleted', 'completed'] as const;

export const listReceiptsSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(receiptSortingOptions)).optional(),
    filter: z
        .object({
            receiptType: z.array(z.enum(receiptTypeOptions)).optional(),
            status: z.array(z.enum(receiptStatusOptions)).optional(),
        })
        .optional(),
});

export type ListReceiptsParams = z.infer<typeof listReceiptsSchema>;
