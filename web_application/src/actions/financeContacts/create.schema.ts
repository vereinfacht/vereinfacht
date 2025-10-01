import { z } from 'zod';
import { financeContactTypeOptions } from './list.schema';

export const genderOptions = ['other', 'male', 'female'] as const;

export const financeContactAttributesSchema = z
    .object({
        firstName: z.string().min(3).max(255).optional(),
        lastName: z.string().min(2).max(255).optional(),
        gender: z
            .enum(genderOptions)
            .nullable()
            .optional()
            .transform((value) => (value === undefined ? null : value)),
        companyName: z.string().min(2).max(255).optional(),
        contactType: z.enum(financeContactTypeOptions),
        email: z.email().optional(),
        phoneNumber: z.string().min(2).max(255).optional(),
        address: z.string().min(2).max(255),
        zipCode: z.string().min(2).max(255),
        city: z.string().min(2).max(255),
        country: z.string().min(2).max(255).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.contactType === 'company' && data.companyName === '') {
            ctx.addIssue({
                code: 'custom',
                message: 'Company name is required when type is company',
                path: ['data', 'attributes', 'companyName'],
            });
        }

        if (data.contactType === 'person' && data.firstName === '') {
            ctx.addIssue({
                code: 'custom',
                message: 'First name is required when type is person',
                path: ['data', 'attributes', 'firstName'],
            });
        }

        if (data.contactType === 'person' && data.lastName === '') {
            ctx.addIssue({
                code: 'custom',
                message: 'Last name is required when type is person',
                path: ['data', 'attributes', 'lastName'],
            });
        }
    });

export const createFinanceContactSchema = z.object({
    data: z.object({
        type: z.literal('finance-contacts'),
        attributes: financeContactAttributesSchema,
        relationships: z.object({
            club: z.object({
                data: z.object({
                    id: z.string(),
                    type: z.literal('clubs'),
                }),
            }),
        }),
    }),
});

export type CreateFinanceContactParams = z.infer<
    typeof createFinanceContactSchema
>;
