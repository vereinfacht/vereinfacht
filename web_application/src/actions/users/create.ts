'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import { CreateUserParams, createUserSchema } from './create.schema';

export const createUser = createAuthenticatedAction(
    'create',
    'users',
    createUserSchema,
    async (body, client) => {
        // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
        const response = await client.POST('/users', {
            body,
        });

        return handleApiResponse(response, 'Failed to create user');
    },
);

export async function createUserFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateUserParams>(
        previousState,
        createUser,
        formData,
        {
            data: {
                type: 'users',
            },
        },
    );
}
