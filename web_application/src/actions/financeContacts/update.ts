'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import {
    UpdateFinanceContactParams,
    updateFinanceContactSchema,
} from './update.schema';

export const updateFinanceContact = createAuthenticatedAction(
    'update',
    'finance-contacts',
    updateFinanceContactSchema,
    async (body, client) => {
        const response = await client.PATCH(
            '/finance-contacts/{finance_contact}',
            {
                params: {
                    path: { finance_contact: body.data.id },
                },
                // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
                body,
            },
        );

        return handleApiResponse(response, 'Failed to update finance contact');
    },
);

export async function updateFinanceContactFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateFinanceContactParams>(
        previousState,
        updateFinanceContact,
        formData,
        {
            data: {
                id,
                type: 'finance-contacts',
            },
        },
    );
}
