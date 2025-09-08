import { z } from 'zod';
import { createReceiptSchema } from './create.schema';
import { idSchema } from '../base/get.schema';

export const updateReceiptSchema = createReceiptSchema.extend({
    data: createReceiptSchema.shape.data.extend({
        id: idSchema,
    }),
});

export type UpdateReceiptParams = z.infer<typeof updateReceiptSchema>;
