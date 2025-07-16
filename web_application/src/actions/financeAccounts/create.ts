import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { createFinanceAccountSchema } from './create.schema';

export const createFinanceAccount = createAuthenticatedAction(
    'create',
    'finance-accounts',
    createFinanceAccountSchema,
    async (params, client) => {
        const response = await client.POST('/finance-accounts', {
            body: params,
        });

        return handleApiResponse(response, 'Failed to create finance account');
    },
);
