import { z } from 'zod';

export const financeAccountAttributesSchema = z.object({
    title: z.string().optional(),
    iban: z.string().optional(),
    bic: z.string().optional(),
    initialBalance: z.number().optional(),
    startsAt: z.string().optional(),
});

export const financeAccountRelationshipsSchema = z
    .object({
        club: z
            .object({
                links: z
                    .object({
                        related: z.string().optional(),
                        self: z.string().optional(),
                    })
                    .optional(),
            })
            .optional(),
        types: z
            .object({
                links: z
                    .object({
                        related: z.string().optional(),
                        self: z.string().optional(),
                    })
                    .optional(),
            })
            .optional(),
        transactions: z
            .object({
                links: z
                    .object({
                        related: z.string().optional(),
                        self: z.string().optional(),
                    })
                    .optional(),
            })
            .optional(),
    })
    .partial()
    .optional();

export type FinanceAccountAttributes = z.infer<
    typeof financeAccountAttributesSchema
>;
export type FinanceAccountRelationships = z.infer<
    typeof financeAccountRelationshipsSchema
>;
