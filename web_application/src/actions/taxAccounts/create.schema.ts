import { z } from 'zod';

export const taxAccountAttributesSchema = z.object({
    accountNumber: z.string().min(2).max(255).optional(),
    description: z.string().min(2).max(1000).optional(),
});

export const taxAccountRelationshipsSchema = z.object({
    club: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('clubs'),
        }),
    }),
});

export const createTaxAccountSchema = z.object({
    data: z.object({
        type: z.literal('tax-accounts'),
        attributes: taxAccountAttributesSchema,
        relationships: taxAccountRelationshipsSchema,
    }),
});

export type CreateTaxAccountParams = z.infer<typeof createTaxAccountSchema>;
