import { z } from 'zod';
import { ibanSchema } from '../financeAccounts/create.schema';

const optionalNumberSchema = z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.coerce.number().min(0).optional(),
);

const optionalStringSchema = z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().optional(),
);

export const createMembershipSchema = z.object({
    data: z.object({
        type: z.literal('memberships'),
        attributes: z.object({
            bankIban: ibanSchema,
            bankAccountHolder: z.string().min(2).max(255),
            startedAt: z.string().min(1),
            endedAt: optionalStringSchema,
            notes: optionalStringSchema,
            voluntaryContribution: optionalNumberSchema,
            status: z.enum(['active', 'applied', 'cancelled']).optional(),
        }),
        relationships: z.object({
            club: z.object({
                data: z.object({
                    id: z.string(),
                    type: z.literal('clubs'),
                }),
            }),
            membershipType: z.object({
                data: z.object({
                    id: z.string(),
                    type: z.literal('membership-types'),
                }),
            }),
            owner: z
                .object({
                    data: z.object({
                        id: z.string(),
                        type: z.literal('members'),
                    }),
                })
                .optional(),
            paymentPeriod: z
                .object({
                    data: z.object({
                        id: z.string(),
                        type: z.literal('payment-periods'),
                    }),
                })
                .optional(),
        }),
    }),
});

export type CreateMembershipParams = z.infer<typeof createMembershipSchema>;
