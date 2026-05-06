'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import { CreateMemberParams, createMemberSchema } from './create.schema';

export const createMember = createAuthenticatedAction(
    'create',
    'members',
    createMemberSchema,
    async (body, client) => {
        const response = await client.POST('/members', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to create member');
    },
);

export async function createMemberFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateMemberParams>(
        previousState,
        createMember,
        formData,
        {
            data: {
                type: 'members',
            },
        },
    );
}
