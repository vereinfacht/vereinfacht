import 'server-only';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { getFinanceAccountSchema } from './get.schema';

export const getFinanceAccount = createAuthenticatedAction(
    'view',
    'finance-accounts',
    getFinanceAccountSchema,
    async (params, client) => {
        const response = await client.GET(
            '/finance-accounts/{finance_account}',
            {
                params: {
                    path: { finance_account: params.id },
                },
            },
        );

        return handleApiResponse(response, 'Failed to fetch finance account');
    },
);
