'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listMembershipTypesSchema } from './list.schema';

export const listMembershipTypes = createAuthenticatedActionWithOptionalParams(
    'view',
    'membershipTypes',
    listMembershipTypesSchema,
    async (query, client) => {
        const response = await client.GET('/membership-types', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch membership types');
    },
);
