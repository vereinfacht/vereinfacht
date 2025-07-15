import { z } from 'zod';

export const financeContactSortingOptions = [
    'fullName',
    '-fullName',
    'companyName',
    '-companyName',
    'city',
    '-city',
] as const;

export const financeContactTypeOptions = ['person', 'company'] as const;

export const listFinanceContactsSchema = z.object({
    // Pagination parameters
    page: z
        .object({
            size: z.number().int().positive().optional(),
            number: z.number().int().positive().optional(),
        })
        .optional(),

    // Sorting parameters
    sort: z.array(z.enum(financeContactSortingOptions)).optional(),

    // Filter parameters
    filter: z
        .object({
            id: z.array(z.string()).optional(),
            type: z.array(z.enum(financeContactTypeOptions)).optional(),
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
