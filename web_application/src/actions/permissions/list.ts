'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listpermissionsSchema } from './list.schema';

export const listPermissions = createAuthenticatedActionWithOptionalParams(
    'view',
    'permissions',
    listpermissionsSchema,
    async (query, client) => {
        const response = await client.GET('/permissions', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch permissions');
    },
);
