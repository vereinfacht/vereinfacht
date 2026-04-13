'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import deleteFormAction from '../base/delete';
import { baseDeleteSchema, DeleteParams } from '../base/delete.schema';

export const deleteDivisionMembershipType = createAuthenticatedAction(
    'delete',
    'division-membership-types',
    baseDeleteSchema,
    async (params, client) => {
        const response = await client.DELETE(
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            '/division-membership-types/{divisionMembershipType}',
            {
                params: {
                    path: { divisionMembershipType: params.id },
                },
            },
        );

        if (response.error) {
            handleApiResponse(
                response,
                'Failed to delete division membership type',
            );
        }

        return true;
    },
);

export async function deleteDivisionMembershipTypeFormAction(
    id: string,
    previousState: FormActionState,
) {
    return await deleteFormAction<DeleteParams>(
        previousState,
        deleteDivisionMembershipType,
        {
            id,
        },
    );
}
