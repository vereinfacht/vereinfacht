'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import deleteFormAction from '../base/delete';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';

export const deleteUser = createAuthenticatedAction(
    'delete',
    'users',
    baseDeleteSchema,
    async (params, client) => {
        const response = await client.DELETE('/users/{user}', {
            params: {
                path: { user: params.id },
            },
        });

        if (response.error) {
            handleApiResponse(response, 'Failed to delete user');
        }

        return true;
    },
);

export async function deleteUserFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(previousState, deleteUser, {
        id,
    });
}
