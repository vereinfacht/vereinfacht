import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { getAccountTransactionsSchema } from './transactions.schema';

export const getAccountTransactions = createAuthenticatedAction(
    'view',
    'transactions',
    getAccountTransactionsSchema,
    async (params, client) => {
        // Build query parameters object
        const queryParams: Record<string, string | number | string[]> = {};

        if (params.page?.size) {
            queryParams['page[size]'] = params.page.size;
        }
        if (params.page?.number) {
            queryParams['page[number]'] = params.page.number;
        }
        if (params.sort) {
            queryParams.sort = params.sort;
        }
        if (params.filter?.id) {
            queryParams['filter[id]'] = params.filter.id;
        }

        // @TODO: refactor to use centralized prepareQuery function
        const query = (
            Object.keys(queryParams).length > 0 ? queryParams : undefined
        ) as any;

        const response = await client.GET(
            '/finance-accounts/{finance_account}/transactions',
            {
                params: {
                    path: { finance_account: params.financeAccountId },
                    query,
                },
            },
        );

        return handleApiResponse(response, 'Failed to fetch transactions');
    },
);
