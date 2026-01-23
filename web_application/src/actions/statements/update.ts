'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import { UpdateStatementParams, updateStatementSchema } from './update.schema';

export const updateStatement = createAuthenticatedAction(
    'update',
    'statements',
    updateStatementSchema,
    async (body, client) => {
        // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
        const response = await client.PATCH('/statements/{statement}', {
            params: {
                path: { statement: body.data.id },
            },
            body,
        });

        return handleApiResponse(response, 'Failed to update statement');
    },
);

export async function updateStatementFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateStatementParams>(
        previousState,
        updateStatement,
        formData,
        {
            data: {
                id,
                type: 'statements',
            },
        },
    );
}
