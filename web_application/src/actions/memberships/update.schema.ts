import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import { ibanSchema } from '../financeAccounts/create.schema';

const optionalNumberSchema = z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.coerce.number().min(0).optional(),
);

const optionalStringSchema = z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().optional(),
);

export const updateMembershipSchema = z.object({
    data: z.object({
        id: idSchema,
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
        relationships: z
            .object({
                membershipType: z
                    .object({
                        data: z.object({
                            id: z.string(),
                            type: z.literal('membership-types'),
                        }),
                    })
                    .optional(),
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
            })
            .optional(),
    }),
});

export type UpdateMembershipParams = z.infer<typeof updateMembershipSchema>;
