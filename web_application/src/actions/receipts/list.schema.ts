import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const receiptSortingOptions = [
    'referenceNumber',
    '-referenceNumber',
    'documentedAt',
    '-documentedAt',
    'amount',
    '-amount',
] as const;

export const receiptTypeOptions = ['income', 'expense'] as const;

export const listReceiptsSchema = baseListSchema.extend({
    sort: z.array(z.enum(receiptSortingOptions)).optional(),
    filter: z
        .object({
            type: z.array(z.enum(receiptTypeOptions)).optional(),
        })
        .optional(),
});

export type ListReceiptsParams = z.infer<typeof listReceiptsSchema>;
