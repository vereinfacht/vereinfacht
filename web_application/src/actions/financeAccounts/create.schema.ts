import { z } from 'zod';
import { ibanPattern } from '@/utils/patterns';

export const accountTypes = ['cash_box', 'bank_account'] as const;
export type FinanceAccountType = (typeof accountTypes)[number];
export const ibanSchema = z.string().regex(ibanPattern, {
    message: 'error:validation.iban',
});

export function extendZodEffects<
    T extends z.ZodEffects<z.ZodObject<any>, any, any>,
>(schema: T, extension: z.ZodSchema) {
    // We can't use .extend() after .refine(), so this is a workaround
    // See https://github.com/colinhacks/zod/issues/454 for more details
    return schema.superRefine((value, ctx) => {
        const result = extension.safeParse(value);
        if (!result.success) {
            result.error.errors.forEach((issue) => ctx.addIssue(issue));
        }
        return result.success;
    });
}

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
                code: z.ZodIssueCode.custom,
                message: 'IBAN is required when type is bank_account',
                path: ['data', 'attributes', 'iban'],
            });
        }

        if (data.accountType === 'cash_box' && !data.initialBalance) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
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
