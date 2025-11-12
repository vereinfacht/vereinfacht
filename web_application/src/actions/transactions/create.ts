'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import {
    CreateTransactionParams,
    createTransactionSchema,
} from './create.schema';

export const createTransaction = createAuthenticatedAction(
    'create',
    'transactions',
    createTransactionSchema,
    async (body, client) => {
        const response = await client.POST('/transactions', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to create transaction');
    },
);

export async function createTransactionFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateTransactionParams>(
        previousState,
        createTransaction,
        formData,
        {
            data: {
                type: 'transactions',
            },
        },
    );
}
