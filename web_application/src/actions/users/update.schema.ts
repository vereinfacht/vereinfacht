import { z } from 'zod';
import { createUserSchema, userAttributesSchema } from './create.schema';
import { idSchema } from '../base/get.schema';

export const updateUserSchema = createUserSchema.extend({
    data: createUserSchema.shape.data.extend({
        id: idSchema,
        type: z.literal('users'),
        attributes: userAttributesSchema,
        relationships: z.object({
            permissions: z
                .object({
                    data: z.array(
                        z
                            .object({
                                id: z.string(),
                                type: z.literal('permissions'),
                            })
                            .nullable(),
                    ),
                })
                .optional(),
        }),
    }),
});

export type UpdateUserParams = z.infer<typeof updateUserSchema>;
