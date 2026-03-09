'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import {
    UpdateMembershipTypeParams,
    updateMembershipTypeSchema,
} from './update.schema';

export async function getUpdateMembershipTypeSchema() {
    return updateMembershipTypeSchema;
}

export const updateMembershipType = createAuthenticatedAction(
    'update',
    'membership-types',
    updateMembershipTypeSchema,
    async (body, client) => {
        const response = await client.PATCH(
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            '/membership-types/{membershipType}',
            {
                params: {
                    path: { membershipType: body.data.id },
                },
                body,
            },
        );

        return handleApiResponse(response, 'Failed to update membership type');
    },
);

export async function updateMembershipTypeFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateMembershipTypeParams>(
        previousState,
        updateMembershipType,
        formData,
        {
            data: {
                id,
                type: 'membership-types',
            },
        },
    );
}
