import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const divisionSortingOptions = ['title', '-title'] as const;

export const listDivisionsSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(divisionSortingOptions)).optional(),
    filter: z
        .object({
            query: z.string().optional(),
        })
        .optional(),
});

export type ListDivisionsParams = z.infer<typeof listDivisionsSchema>;
