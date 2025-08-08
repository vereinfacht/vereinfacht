'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listPermissionsSchema } from './list.schema';

export const listPermissions = createAuthenticatedActionWithOptionalParams(
    'view',
    'permissions',
    listPermissionsSchema,
    async (query, client) => {
        const response = await client.GET('/permissions', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch permissions');
    },
);
