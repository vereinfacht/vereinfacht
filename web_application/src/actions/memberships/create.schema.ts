import { z } from 'zod';
import { ibanSchema } from '../financeAccounts/create.schema';

export const membershipStatus = ['active', 'applied', 'cancelled'] as const;

export const membershipAttributesSchema = z.object({
    bankIban: ibanSchema,
    bankAccountHolder: z.string().min(2).max(255),
    startedAt: z.coerce.date().min(new Date('1900-01-01')),
    endedAt: z.coerce
        .date()
        .min(new Date('1900-01-01'))
        .optional()
        .or(z.literal('')),
    notes: z.string().optional(),
    voluntaryContribution: z.coerce.number().min(0).optional(),
    status: z.enum(membershipStatus),
});

export const membershipDateRefinement = (
    attributes: { startedAt: Date; endedAt?: Date | '' },
    ctx: z.RefinementCtx,
) => {
    if (!attributes.endedAt) {
        return;
    }

    const startedAt = attributes.startedAt;
    const endedAt = attributes.endedAt;

    if (!(startedAt instanceof Date) || !(endedAt instanceof Date)) {
        return;
    }

    if (endedAt <= startedAt) {
        ctx.addIssue({
            code: 'custom',
            message: 'End date must be after start date',
            path: ['endedAt'],
        });
    }
};

export const membershipRelationshipsSchema = z.object({
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
});

export const createMembershipSchema = z.object({
    data: z.object({
        type: z.literal('memberships'),
        attributes: membershipAttributesSchema.superRefine(
            membershipDateRefinement,
        ),
        relationships: membershipRelationshipsSchema,
    }),
});

export type CreateMembershipParams = z.infer<typeof createMembershipSchema>;
