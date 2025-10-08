import { z } from 'zod';

export const createMediaSchema = z.object({
    data: z.object({
        type: z.literal('media'),
        // attributes: z.object({
        //     // name: z.string().min(1).max(255),
        // }),
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

export type CreateMediaParams = z.infer<typeof createMediaSchema>;
