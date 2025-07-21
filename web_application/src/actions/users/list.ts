'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listUsersSchema } from './list.schema';

export const listUsers = createAuthenticatedActionWithOptionalParams(
    'view',
    'users',
    listUsersSchema,
    async (query, client) => {
        const response = await client.GET('/users', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch users');
    },
);
