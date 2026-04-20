'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import deleteFormAction from '../base/delete';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';

export const deleteMember = createAuthenticatedAction(
    'delete',
    'members',
    baseDeleteSchema,
    async (params, client) => {
        // @ts-expect-error: path exists in backend but generated schema may lag
        const response = await client.DELETE('/members/{member}', {
            params: {
                path: { member: params.id },
            },
        });

        if (response.error) {
            handleApiResponse(response, 'Failed to delete member');
        }

        return true;
    },
);

export async function deleteMemberFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(previousState, deleteMember, {
        id,
    });
}
