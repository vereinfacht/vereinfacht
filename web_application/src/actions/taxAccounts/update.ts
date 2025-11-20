'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import {
    UpdateTaxAccountParams,
    updateTaxAccountSchema,
} from './update.schema';

export const updateTaxAccount = createAuthenticatedAction(
    'update',
    'tax-accounts',
    updateTaxAccountSchema,
    async (body, client) => {
        // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
        const response = await client.PATCH('/tax-accounts/{taxAccount}', {
            params: {
                path: { taxAccount: body.data.id },
            },
            body,
        });

        return handleApiResponse(response, 'Failed to update tax account');
    },
);

export async function updateTaxAccountFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateTaxAccountParams>(
        previousState,
        updateTaxAccount,
        formData,
        {
            data: {
                id,
                type: 'tax-accounts',
            },
        },
    );
}
