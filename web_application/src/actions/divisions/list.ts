'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listDivisionsSchema } from './list.schema';

export const listDivisions = createAuthenticatedActionWithOptionalParams(
    'view',
    'divisions',
    listDivisionsSchema,
    async (query, client) => {
        const response = await client.GET('/divisions', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch divisions');
    },
);
