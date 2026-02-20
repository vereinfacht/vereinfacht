'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import { UpdateDivisionParams, updateDivisionSchema } from './update.schema';

export async function getUpdateDivisionSchema() {
    return updateDivisionSchema;
}

export const updateDivision = createAuthenticatedAction(
    'update',
    'divisions',
    updateDivisionSchema,
    async (body, client) => {
        const response = await client.PATCH('/divisions/{division}', {
            params: {
                path: { division: body.data.id },
            },
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to update division');
    },
);

export async function updateDivisionFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateDivisionParams>(
        previousState,
        updateDivision,
        formData,
        {
            data: {
                id,
                type: 'divisions',
            },
        },
    );
}
