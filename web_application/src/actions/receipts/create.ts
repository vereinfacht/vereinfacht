'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import { CreateReceiptParams, createReceiptSchema } from './create.schema';

export const createReceipt = createAuthenticatedAction(
    'create',
    'receipts',
    createReceiptSchema,
    async (body, client) => {
        // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
        const response = await client.POST('/receipts', {
            body,
        });

        return handleApiResponse(response, 'Failed to create receipt');
    },
);

export async function createReceiptFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateReceiptParams>(
        previousState,
        createReceipt,
        formData,
        {
            data: {
                type: 'receipts',
            },
        },
    );
}
