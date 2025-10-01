'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import deleteFormAction from '../base/delete';

export const deleteFinanceAccount = createAuthenticatedAction(
    'delete',
    'finance-accounts',
    baseDeleteSchema,
    async (params, client) => {
        const response = await client.DELETE(
            '/finance-accounts/{finance_account}',
            {
                params: {
                    path: { finance_account: params.id },
                },
            },
        );

        if (response.error) {
            handleApiResponse(response, 'Failed to delete finance account');
        }

        return true;
    },
);

export async function deleteFinanceAccountFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(
        previousState,
        deleteFinanceAccount,
        { id },
    );
}
