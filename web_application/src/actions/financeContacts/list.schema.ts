import { z } from 'zod';

export const listFinanceContactsSortingOptions = [
    'createdAt',
    '-createdAt',
    'updatedAt',
    '-updatedAt',
] as const;

export const listFinanceContactsSchema = z.object({
    // Pagination parameters
    page: z
        .object({
            size: z.number().int().positive().optional(),
            number: z.number().int().positive().optional(),
        })
        .optional(),

    // Sorting parameters
    sort: z.array(z.enum(listFinanceContactsSortingOptions)).optional(),

    // Filter parameters
    filter: z
        .object({
            id: z.array(z.string()).optional(),
            financeAccountId: z.string().optional(),
        })
        .optional(),

    // Include relationships
    include: z.array(z.string()).optional(),

    // Fields to include in the response
    // @TODO: integrate relationship schema for allowed fields?
    fields: z.record(z.string(), z.array(z.string()).optional()).optional(),
});

export type ListFinanceContactsParams = z.infer<
    typeof listFinanceContactsSchema
>;
