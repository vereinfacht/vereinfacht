import { z } from 'zod';

export const financialStatementAttributesSchema = z.object({
    includeMedia: z.boolean().optional(),
    receipts: z.preprocess((value) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    }, z.array(z.string())),
});

export const exportFinancialStatementSchema = z.object({
    data: z.object({
        type: z.literal('financial-statements'),
        attributes: financialStatementAttributesSchema,
    }),
});

export type ExportFinancialStatementParams = z.infer<
    typeof exportFinancialStatementSchema
>;
