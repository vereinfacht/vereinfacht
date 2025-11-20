'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import { CreateStatementParams, createStatementSchema } from './create.schema';

export const createStatement = createAuthenticatedAction(
    'create',
    'statements',
    createStatementSchema,
    async (body, client) => {
        const response = await client.POST('/statements', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(response, 'Failed to create statement');
    },
);

export async function createStatementFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    return await createFormAction<CreateStatementParams>(
        previousState,
        createStatement,
        formData,
        {
            data: {
                type: 'statements',
            },
        },
    );
}
