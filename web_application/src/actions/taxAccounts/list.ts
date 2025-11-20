'use server';

import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import { listTaxAccountsSchema } from './list.schema';

export const listTaxAccounts = createAuthenticatedActionWithOptionalParams(
    'view',
    'tax-accounts',
    listTaxAccountsSchema,
    async (query, client) => {
        const response = await client.GET('/tax-accounts', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch tax accounts');
    },
);
