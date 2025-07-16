import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { deleteFinanceAccountSchema } from './delete.schema';

export const deleteFinanceAccount = createAuthenticatedAction(
    'delete',
    'finance-accounts',
    deleteFinanceAccountSchema,
    async (params, client) => {
        const response = await client.DELETE(
            '/finance-accounts/{finance_account}',
            {
                params: {
                    path: { finance_account: params.id },
                },
            },
        );

        // DELETE returns 204 No Content on success, so we handle it specially
        if (response.error) {
            handleApiResponse(response, 'Failed to delete finance account');
        }

        return true;
    },
);
