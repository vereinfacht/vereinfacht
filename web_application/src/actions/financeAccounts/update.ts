import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { updateFinanceAccountSchema } from './update.schema';

export const updateFinanceAccount = createAuthenticatedAction(
    'update',
    'finance-accounts',
    updateFinanceAccountSchema,
    async (params, client) => {
        const response = await client.PATCH(
            '/finance-accounts/{finance_account}',
            {
                params: {
                    path: { finance_account: params.id },
                },
                body: params,
            },
        );

        return handleApiResponse(response, 'Failed to update finance account');
    },
);
