'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import {
    CreateFinanceContactParams,
    createFinanceContactSchema,
} from './create.schema';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';

export const createFinanceContact = createAuthenticatedAction(
    'create',
    'finance-contacts',
    createFinanceContactSchema,
    async (body, client) => {
        const response = await client.POST('/finance-contacts', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to create finance contact');
    },
);

export async function createFinanceContactFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateFinanceContactParams>(
        previousState,
        createFinanceContact,
        formData,
        {
            data: {
                type: 'finance-contacts',
            },
        },
    );
}
