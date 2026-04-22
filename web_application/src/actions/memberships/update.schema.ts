import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import { ibanSchema } from '../financeAccounts/create.schema';
import { membershipStatus } from './create.schema';

export const updateMembershipSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('memberships'),
        attributes: z
            .object({
                bankIban: ibanSchema,
                bankAccountHolder: z.string().min(2).max(255),
                startedAt: z.string().min(1),
                endedAt: z.string().optional(),
                notes: z.string().optional(),
                voluntaryContribution: z.coerce.number().min(0).optional(),
                status: z.enum(membershipStatus).optional(),
            })
            .superRefine((attributes, ctx) => {
                if (!attributes.endedAt) {
                    return;
                }

                const startedAt = new Date(attributes.startedAt);
                const endedAt = new Date(attributes.endedAt);

                if (
                    Number.isNaN(startedAt.getTime()) ||
                    Number.isNaN(endedAt.getTime())
                ) {
                    return;
                }

                if (endedAt <= startedAt) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'End date must be after start date',
                        path: ['endedAt'],
                    });
                }
            }),
        relationships: z
            .object({
                membershipType: z.object({
                    data: z.object({
                        id: z.string(),
                        type: z.literal('membership-types'),
                    }),
                }),
                owner: z.object({
                    data: z.object({
                        id: z.string(),
                        type: z.literal('members'),
                    }),
                }),
                paymentPeriod: z.object({
                    data: z.object({
                        id: z.string(),
                        type: z.literal('payment-periods'),
                    }),
                }),
            })
            .optional(),
    }),
});

export type UpdateMembershipParams = z.infer<typeof updateMembershipSchema>;
