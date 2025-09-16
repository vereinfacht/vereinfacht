import { z } from 'zod';
import { createReceiptSchema } from './create.schema';
import { idSchema } from '../base/get.schema';

export const updateReceiptSchema = z.object({
    ...createReceiptSchema.shape,
    data: z.object({
        ...createReceiptSchema.shape.data,
        id: idSchema,
    }),
});

export type UpdateReceiptParams = z.infer<typeof updateReceiptSchema>;
