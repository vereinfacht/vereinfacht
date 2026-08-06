'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listActivityLogsSchema } from './list.schema';

export const listActivityLogs = createAuthenticatedActionWithOptionalParams(
    'view',
    'activity-logs',
    listActivityLogsSchema,
    async (query, client) => {
        const response = await client.GET('/activity-logs', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch activity logs');
    },
);
