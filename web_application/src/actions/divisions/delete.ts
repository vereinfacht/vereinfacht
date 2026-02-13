'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import deleteFormAction from '../base/delete';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';

export const deleteDivision = createAuthenticatedAction(
    'delete',
    'divisions',
    baseDeleteSchema,
    async (params, client) => {
        // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
        const response = await client.DELETE('/divisions/{division}', {
            params: {
                path: { division: params.id },
            },
        });

        if (response.error) {
            handleApiResponse(response, 'Failed to delete division');
        }

        return true;
    },
);

export async function deleteDivisionFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(previousState, deleteDivision, {
        id,
    });
}
