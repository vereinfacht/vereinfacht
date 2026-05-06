'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import {
    CreateMembershipParams,
    createMembershipSchema,
} from './create.schema';

export const createMembership = createAuthenticatedAction(
    'create',
    'memberships',
    createMembershipSchema,
    async (body, client) => {
        const response = await client.POST('/memberships', {
            // @ts-expect-error: api specs do not include full relationship payload requirements
            body,
        });

        return handleApiResponse(response, 'Failed to create membership');
    },
);

export async function createMembershipFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateMembershipParams>(
        previousState,
        createMembership,
        formData,
        {
            data: {
                type: 'memberships',
            },
        },
    );
}
