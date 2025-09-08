'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import {
    CreateFinanceAccountParams,
    createFinanceAccountSchema,
} from './create.schema';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';

export const createFinanceAccount = createAuthenticatedAction(
    'create',
    'finance-Accounts',
    // @ts-expect-error: schema is correct
    createFinanceAccountSchema,
    async (body, client) => {
        const response = await client.POST('/finance-accounts', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to create finance account');
    },
);

export async function createFinanceAccountFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateFinanceAccountParams>(
        previousState,
        createFinanceAccount,
        formData,
        {
            data: {
                type: 'finance-accounts',
            },
        },
    );
}
