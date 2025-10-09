import { File } from 'node:buffer';
import z from 'zod';
import { idSchema } from '../base/get.schema';

export const uploadSchema = z.object({
    collectionName: z.enum(['receipts']),
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
            if (
                !['image/jpeg', 'image/png', 'application/pdf'].includes(
                    file.type,
                )
            ) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'File type must be JPEG, PNG, or PDF',
                    path: ['file'],
                });
            }
        }),
    clubId: idSchema,
});
