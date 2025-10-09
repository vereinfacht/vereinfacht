'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import deleteFormAction from '../base/delete';

export const deleteMedia = createAuthenticatedAction(
    'delete',
    'media',
    baseDeleteSchema,
    async (params, client) => {
        const response = await client.DELETE('/media/{medium}', {
            params: {
                path: { medium: params.id },
            },
        });

        if (response.error) {
            handleApiResponse(response, 'Failed to delete media');
        }

        return true;
    },
);

export async function deleteMediaFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(previousState, deleteMedia, {
        id,
    });
}
