'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import {
    UpdateMembershipParams,
    updateMembershipSchema,
} from './update.schema';

export const updateMembershipApi = createAuthenticatedAction(
    'update',
    'memberships',
    updateMembershipSchema,
    async (body, client) => {
        const response = await client.PATCH('/memberships/{membership}', {
            params: {
                path: { membership: body.data.id },
            },
            // @ts-expect-error: path exists in backend but generated schema may lag
            body,
        });

        return handleApiResponse(response, 'Failed to update membership');
    },
);

export async function updateMembershipFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateMembershipParams>(
        previousState,
        updateMembershipApi,
        formData,
        {
            data: {
                id,
                type: 'memberships',
            },
        },
    );
}
