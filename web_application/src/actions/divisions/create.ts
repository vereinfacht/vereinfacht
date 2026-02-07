'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import { CreateDivisionParams, createDivisionSchema } from './create.schema';

export const createDivision = createAuthenticatedAction(
    'create',
    'divisions',
    createDivisionSchema,
    async (body, client) => {
        const response = await client.POST('/divisions', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to create division');
    },
);

export async function createDivisionFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateDivisionParams>(
        previousState,
        createDivision,
        formData,
        {
            data: {
                type: 'divisions',
            },
        },
    );
}
