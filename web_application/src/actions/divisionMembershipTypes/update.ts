'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import updateFormAction from '../base/update';
import {
    UpdateDivisionMembershipTypeParams,
    updateDivisionMembershipTypeSchema,
} from './update.schema';

export const updateDivisionMembershipType = createAuthenticatedAction(
    'update',
    'division-membership-types',
    updateDivisionMembershipTypeSchema,
    async (body, client) => {
        const response = await (client as any).PATCH(
            '/division-membership-types/{division_membership_type}',
            {
                params: {
                    path: {
                        division_membership_type: body.data.id,
                    },
                },
                body,
            },
        );

        return handleApiResponse(
            response,
            'Failed to update division membership type',
        );
    },
);

export async function updateDivisionMembershipTypeFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateDivisionMembershipTypeParams>(
        previousState,
        updateDivisionMembershipType,
        formData,
        {
            data: {
                id,
                type: 'division-membership-types',
            },
        },
    );
}
