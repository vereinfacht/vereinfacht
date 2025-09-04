import { z } from 'zod';
import { createUserSchema } from './create.schema';
import { idSchema } from '../base/get.schema';

export const updateUserSchema = createUserSchema.extend({
    data: createUserSchema.shape.data.extend({
        id: idSchema,
    }),
});

export type UpdateUserParams = z.infer<typeof updateUserSchema>;
