'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listStatementsSchema } from './list.schema';

export const listStatements = createAuthenticatedActionWithOptionalParams(
    'view',
    'statements',
    listStatementsSchema,
    async (query, client) => {
        const response = await client.GET('/statements', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch statements');
    },
);
