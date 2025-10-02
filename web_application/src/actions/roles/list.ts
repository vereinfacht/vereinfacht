'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listRolesSchema } from './list.schema';

export const listRoles = createAuthenticatedActionWithOptionalParams(
    'view',
    'roles',
    listRolesSchema,
    async (query, client) => {
        const response = await client.GET('/roles', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch roles');
    },
);
