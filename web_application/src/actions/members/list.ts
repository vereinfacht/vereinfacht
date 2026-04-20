'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listMembersSchema } from './list.schema';

export const listMembers = createAuthenticatedActionWithOptionalParams(
    'view',
    'members',
    listMembersSchema,
    async (query, client) => {
        // @ts-expect-error: prepareQuery() does not return the expected type
        const response = await client.GET('/members', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch members');
    },
);
