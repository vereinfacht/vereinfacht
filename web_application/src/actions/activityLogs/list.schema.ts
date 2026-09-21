import { z } from 'zod';
import { baseListSchema } from '../base/list.schema';

export const listActivityLogsSchema = z.object({
    ...baseListSchema.shape,
    filter: z
        .object({
            subjectType: z.string().optional(),
            subjectId: z.union([z.string(), z.number()]).optional(),
        })
        .optional(),
});

export type ListActivityLogsParams = z.infer<typeof listActivityLogsSchema>;
