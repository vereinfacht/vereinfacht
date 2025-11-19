'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import {
    CreateTaxAccountParams,
    createTaxAccountSchema,
} from './create.schema';

export const createTaxAccount = createAuthenticatedAction(
    'create',
    'tax-accounts',
    createTaxAccountSchema,
    async (body, client) => {
        const response = await client.POST('/tax-accounts', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to create tax account');
    },
);

export async function createTaxAccountFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateTaxAccountParams>(
        previousState,
        createTaxAccount,
        formData,
        {
            data: {
                type: 'tax-accounts',
            },
        },
    );
}
