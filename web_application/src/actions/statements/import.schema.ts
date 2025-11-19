import { File } from 'node:buffer';
import z from 'zod';
import { idSchema } from '../base/get.schema';

export const importStatementsSchema = z.object({
    financeAccountId: idSchema,
    file: z
        .any()
        .or(z.instanceof(File))
        .transform((file) => file as File)
        .superRefine((file, ctx) => {
            if (file.size >= 5 * 1024 * 1024) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'File size must be less than 5MB',
                    path: ['file'],
                });
            }

            const allowedTypes = [
                'application/octet-stream',
                'application/x-sta',
            ];

            const fileName = file.name.toLowerCase();
            const hasValidExtension =
                fileName.endsWith('.sta') || fileName.endsWith('.mta');

            if (!allowedTypes.includes(file.type) && !hasValidExtension) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'File type not supported.',
                    path: ['file'],
                });
            }
        }),
});
