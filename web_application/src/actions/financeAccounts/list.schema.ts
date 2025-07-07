import { z } from 'zod';

export const listFinanceAccountsSchema = z.object({
    // Pagination parameters
    page: z
        .object({
            size: z.number().int().positive().optional(),
            number: z.number().int().positive().optional(),
        })
        .optional(),

    // Sorting parameters
    sort: z
        .array(
            z.enum([
                'id',
                '-id',
                'createdAt',
                '-createdAt',
                'updatedAt',
                '-updatedAt',
            ]),
        )
        .optional(),

    // Filter parameters
    filter: z
        .object({
            id: z.array(z.string()).optional(),
        })
        .optional(),

    // Include relationships
    include: z.array(z.string()).optional(),
});

export type ListFinanceAccountsParams = z.infer<
    typeof listFinanceAccountsSchema
>;
