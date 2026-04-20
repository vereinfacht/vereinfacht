'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import deleteFormAction from '../base/delete';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';

export const deleteMembership = createAuthenticatedAction(
    'delete',
    'memberships',
    baseDeleteSchema,
    async (params, client) => {
        // @ts-expect-error: prepareQuery() does not return the expected type
        const response = await client.DELETE('/memberships/{membership}', {
            params: {
                path: { membership: params.id },
            },
        });

        if (response.error) {
            handleApiResponse(response, 'Failed to delete membership');
        }

        return true;
    },
);

export async function deleteMembershipFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(
        previousState,
        deleteMembership,
        {
            id,
        },
    );
}
