import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const queryFilterSchema = z.string().optional();

export const receiptSortingOptions = ['amount', '-amount'] as const;

export const receiptTypeOptions = ['income', 'expense'] as const;
export const receiptStatusOptions = [
    'empty',
    'incompleted',
    'completed',
] as const;
export const receiptHasMediaOptions = ['true', 'false'] as const;

export const listReceiptsSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(receiptSortingOptions)).optional(),
    filter: z
        .object({
            receiptType: z.array(z.enum(receiptTypeOptions)).optional(),
            status: z.array(z.enum(receiptStatusOptions)).optional(),
            media: z.boolean().optional(),
            query: queryFilterSchema,
            documentDate: z
                .object({
                    from: z.string().optional(),
                    to: z.string().optional(),
                })
                .optional(),
        })
        .optional(),
});

export type ListReceiptsParams = z.infer<typeof listReceiptsSchema>;
