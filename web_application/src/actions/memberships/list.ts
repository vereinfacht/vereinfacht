'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listMembershipsSchema } from './list.schema';

export const listMemberships = createAuthenticatedActionWithOptionalParams(
    'view',
    'memberships',
    listMembershipsSchema,
    async (query, client) => {
        const response = await client.GET('/memberships', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch memberships');
    },
);
