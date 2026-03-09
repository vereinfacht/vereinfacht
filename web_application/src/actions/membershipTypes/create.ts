'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import {
    CreateMembershipTypeParams,
    createMembershipTypeSchema,
} from './create.schema';

export const createMembershipType = createAuthenticatedAction(
    'create',
    'membership-types',
    createMembershipTypeSchema,
    async (body, client) => {
        const response = await client.POST('/membership-types', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to create membership type');
    },
);

export async function createMembershipTypeFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateMembershipTypeParams>(
        previousState,
        createMembershipType,
        formData,
        {
            data: {
                type: 'membership-types',
            },
        },
    );
}
