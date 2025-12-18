import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const statementSortingOptions = [
    'date',
    '-date',
    'amount',
    '-amount',
] as const;

export const statementTypeOptions = ['collective', 'individual'] as const;

export const listStatementsSchema = z.object({
    ...baseListSchema.shape,
    sort: z.array(z.enum(statementSortingOptions)).optional(),
    filter: z
        .object({
            financeAccountId: z.string().optional(),
            statementType: z.enum(statementTypeOptions).optional(),
        })
        .optional(),
});

export type ListStatementsParams = z.infer<typeof listStatementsSchema>;
