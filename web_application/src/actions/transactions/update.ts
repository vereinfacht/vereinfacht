'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import {
    UpdateTransactionParams,
    updateTransactionSchema,
} from './update.schema';

export const updateTransaction = createAuthenticatedAction(
    'update',
    'transactions',
    updateTransactionSchema,
    async (body, client) => {
        const response = await client.PATCH('/transactions/{transaction}', {
            params: {
                path: { transaction: body.data.id },
            },
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to update transaction');
    },
);

export async function updateTransactionFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateTransactionParams>(
        previousState,
        updateTransaction,
        formData,
        {
            data: {
                id,
                type: 'transactions',
            },
        },
    );
}
