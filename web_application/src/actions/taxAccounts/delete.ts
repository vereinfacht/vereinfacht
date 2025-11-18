'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import deleteFormAction from '../base/delete';

export const deleteTaxAccount = createAuthenticatedAction(
    'delete',
    'tax-accounts',
    baseDeleteSchema,
    async (params, client) => {
        // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
        const response = await client.DELETE('/tax-accounts/{taxAccount}', {
            params: {
                path: { taxAccount: params.id },
            },
        });

        if (response.error) {
            handleApiResponse(response, 'Failed to delete tax account');
        }

        return true;
    },
);

export async function deleteTaxAccountFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(
        previousState,
        deleteTaxAccount,
        { id },
    );
}
