import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const paymentPeriodSortingOptions = ['title', '-title'] as const;

export const listPaymentPeriodsSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(paymentPeriodSortingOptions)).optional(),
    filter: z
        .object({
            query: z.string().optional(),
        })
        .optional(),
});

export type ListPaymentPeriodsParams = z.infer<typeof listPaymentPeriodsSchema>;
