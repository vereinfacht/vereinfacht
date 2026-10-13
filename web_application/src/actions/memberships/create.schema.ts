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
    notes: z.string().max(1000).optional(),
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
    owner: z
        .object({
            data: z.object({
                id: z.string(),
                type: z.literal('members'),
            }),
        })
        .optional(),
    paymentPeriod: z.object({
        data: z.object({
            id: z.string(),
            type: z.literal('payment-periods'),
        }),
    }),
});

export const sharedMemberContactSchema = z.object({
    address: z.string().trim().min(2),
    zipCode: z.string().trim().min(2),
    city: z.string().trim().min(2),
    country: z.string().trim().min(2),
    email: z.email(),
    phoneNumber: z.string().nullish(),
});

export const formMemberSchema = z
    .object({
        mode: z.enum(['create', 'select']).default('create'),
        existingMemberId: z.string().nullish(),
        useSameAddressAsMember1: z.boolean().default(false),
        divisions: z.array(z.string()).nullish(),
        memberType: z.string().nullish(),
        firstName: z.string().nullish(),
        lastName: z.string().nullish(),
        email: z.string().nullish(),
        gender: z.string().nullish(),
        birthday: z.string().nullish(),
        phoneNumber: z.string().nullish(),
        address: z.string().nullish(),
        zipCode: z.string().nullish(),
        city: z.string().nullish(),
        country: z.string().nullish(),
        hasConsentedMediaPublication: z.boolean().nullish(),
    })
    .superRefine((member, ctx) => {
        if (member.mode === 'select') {
            if (!member.existingMemberId?.trim()) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Please select a member',
                    path: ['existingMemberId'],
                });
            }

            return;
        }

        if (!member.firstName?.trim() || member.firstName.trim().length < 2) {
            ctx.addIssue({
                code: 'custom',
                message: 'First name must contain at least 2 characters',
                path: ['firstName'],
            });
        }

        if (!member.lastName?.trim() || member.lastName.trim().length < 2) {
            ctx.addIssue({
                code: 'custom',
                message: 'Last name must contain at least 2 characters',
                path: ['lastName'],
            });
        }

        if (member.useSameAddressAsMember1) {
            return;
        }

        if (!member.email?.trim()) {
            ctx.addIssue({
                code: 'custom',
                message: 'Required field',
                path: ['email'],
            });
        } else if (!z.email().safeParse(member.email).success) {
            ctx.addIssue({
                code: 'custom',
                message: 'Invalid email format',
                path: ['email'],
            });
        }

        if (member.phoneNumber?.trim()) {
            const phoneRegex = /^[+]{1}(?:[0-9-()/.]\s?){6,15}[0-9]{1}$/;

            if (!phoneRegex.test(member.phoneNumber)) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Invalid phone number format',
                    path: ['phoneNumber'],
                });
            }
        }

        const requiredAddressFields = [
            'address',
            'zipCode',
            'city',
            'country',
        ] as const;

        for (const field of requiredAddressFields) {
            if (!member[field]?.trim() || member[field].trim().length < 2) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Must contain at least 2 characters',
                    path: [field],
                });
            }
        }
    });
export const createMembershipSchema = z.object({
    data: z.object({
        type: z.literal('memberships'),
        attributes: membershipAttributesSchema.superRefine(
            membershipDateRefinement,
        ),
        relationships: membershipRelationshipsSchema,
    }),
    members: z.array(formMemberSchema).min(1),
});

export type CreateMembershipParams = z.infer<typeof createMembershipSchema>;
