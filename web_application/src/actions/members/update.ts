'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import { UpdateMemberParams, updateMemberSchema } from './update.schema';

export const updateMember = createAuthenticatedAction(
    'update',
    'members',
    updateMemberSchema,
    async (body, client) => {
        // @ts-expect-error: path exists in backend but generated schema may lag
        const response = await client.PATCH('/members/{member}', {
            params: {
                path: { member: body.data.id },
            },
            body,
        });

        return handleApiResponse(response, 'Failed to update member');
    },
);

export async function updateMemberFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateMemberParams>(
        previousState,
        updateMember,
        formData,
        {
            data: {
                id,
                type: 'members',
            },
        },
    );
}
