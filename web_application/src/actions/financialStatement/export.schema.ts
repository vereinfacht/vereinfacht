import z from 'zod';
import { zfd } from 'zod-form-data';

export const exportFinancialStatementSchema = zfd.formData({
    includeMedia: zfd.checkbox(),
    receipts: zfd.repeatable(),
});

export type ExportFinancialStatementParams = z.infer<
    typeof exportFinancialStatementSchema
>;
