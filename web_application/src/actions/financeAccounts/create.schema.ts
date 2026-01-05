import { z } from 'zod';
import { ibanPattern } from '@/utils/patterns';

export const accountTypes = ['cash_box', 'bank_account'] as const;
export type FinanceAccountType = (typeof accountTypes)[number];
export const ibanSchema = z.stringFormat('iban', ibanPattern, {
    message: 'Please enter a valid IBAN.',
});

export const financeAccountAttributesSchema = z
    .object({
        title: z.string().min(2).max(100),
        iban: ibanSchema.optional(),
        initialBalance: z
            .string()
            .optional()
            .transform((value) => {
                if (!value) {
                    return 0;
                }

                const parsedValue = parseFloat(value.toString());

                return isNaN(parsedValue) ? 0 : parsedValue;
            }),
        accountType: z.enum(accountTypes),
    })
    .superRefine((data, ctx) => {
        if (data.accountType === 'bank_account' && !data.iban) {
            ctx.addIssue({
                code: 'custom',
                message: 'IBAN is required when type is bank_account',
                path: ['data', 'attributes', 'iban'],
            });
        }

        if (
            data.accountType === 'cash_box' &&
            (data.initialBalance === undefined || data.initialBalance === null)
        ) {
            ctx.addIssue({
                code: 'custom',
                message: 'Initial balance is required when type is cash_box',
                path: ['data', 'attributes', 'initialBalance'],
            });
        }
    });

export const createFinanceAccountSchema = z.object({
    data: z.object({
        type: z.literal('finance-accounts'),
        attributes: financeAccountAttributesSchema,
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

export type CreateFinanceAccountParams = z.infer<
    typeof createFinanceAccountSchema
>;
