import { z } from 'zod';
import { idSchema } from '../base/get.schema';
import { userAttributesSchema } from './create.schema';

export const updateUserAttributesSchema = userAttributesSchema.extend({
    password: z.string().min(8).max(255).optional(),
});

export const updateUserSchema = z.object({
    data: z.object({
        id: idSchema,
        type: z.literal('users'),
        attributes: updateUserAttributesSchema,
        relationships: z.object({
            roles: z.object({
                data: z.array(
                    z.object({
                        id: z.string(),
                        type: z.literal('roles'),
                    }),
                ),
            }),
        }),
    }),
});

export type UpdateUserParams = z.infer<typeof updateUserSchema>;
