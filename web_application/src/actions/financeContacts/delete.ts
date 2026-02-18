'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import deleteFormAction from '../base/delete';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';

export const deleteFinanceContact = createAuthenticatedAction(
    'delete',
    'finance-contacts',
    baseDeleteSchema,
    async (params, client) => {
        const response = await client.DELETE(
            '/finance-contacts/{finance_contact}',
            {
                params: {
                    path: { finance_contact: params.id },
                },
            },
        );

        if (response.error) {
            handleApiResponse(response, 'Failed to delete finance contact');
        }

        return true;
    },
);

export async function deleteFinanceContactFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(
        previousState,
        deleteFinanceContact,
        {
            id,
        },
    );
}
