'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import { UpdateReceiptParams, updateReceiptSchema } from './update.schema';

export const updateReceipt = createAuthenticatedAction(
    'update',
    'receipts',
    updateReceiptSchema,
    async (body, client) => {
        // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
        const response = await client.PATCH('/receipts/{receipt}', {
            params: {
                path: { receipt: body.data.id },
            },
            body,
        });

        return handleApiResponse(response, 'Failed to update receipt');
    },
);

export async function updateReceiptFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateReceiptParams>(
        previousState,
        updateReceipt,
        formData,
        {
            data: {
                id,
                type: 'receipts',
            },
        },
    );
}
