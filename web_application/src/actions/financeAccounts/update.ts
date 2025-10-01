'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import {
    UpdateFinanceAccountParams,
    updateFinanceAccountSchema,
} from './update.schema';

export const updateFinanceAccount = createAuthenticatedAction(
    'update',
    'finance-accounts',
    updateFinanceAccountSchema,
    async (body, client) => {
        const response = await client.PATCH(
            '/finance-accounts/{finance_account}',
            {
                params: {
                    path: { finance_account: body.data.id },
                },
                // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
                body,
            },
        );

        return handleApiResponse(response, 'Failed to update finance account');
    },
);

export async function updateFinanceAccountFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateFinanceAccountParams>(
        previousState,
        updateFinanceAccount,
        formData,
        {
            data: {
                id,
                type: 'finance-accounts',
            },
        },
    );
}
