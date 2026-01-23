'use server';

import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { UpdateUserParams, updateUserSchema } from './update.schema';

export const updateUser = createAuthenticatedAction(
    'update',
    'users',
    updateUserSchema,
    async (body, client) => {
        const response = await client.PATCH('/users/{user}', {
            params: {
                path: { user: body.data.id },
            },
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to update user');
    },
);

export async function updateUserFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateUserParams>(
        previousState,
        updateUser,
        formData,
        {
            data: {
                id,
                type: 'users',
            },
        },
    );
}
