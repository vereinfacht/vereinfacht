import {
    createAuthenticatedActionWithOptionalParams,
    handleApiResponse,
} from '@/lib/api/utils';
import 'server-only';
import { listTransactionsSchema } from './list.schema';

export const listTransactions = createAuthenticatedActionWithOptionalParams(
    'view',
    'transactions',
    listTransactionsSchema,
    async (query, client) => {
        const response = await client.GET('/transactions', {
            params: {
                query,
            },
        });

        return handleApiResponse(response, 'Failed to fetch transactions');
    },
);
