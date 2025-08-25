'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listReceiptsSchema } from './list.schema';

export const listReceipts = createAuthenticatedActionWithOptionalParams(
    'view',
    'receipts',
    listReceiptsSchema,
    async (query, client) => {
        const response = await client.GET('/receipts', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch receipts');
    },
);
