'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import createFormAction from '../base/create';
import {
    CreateDivisionMembershipTypeParams,
    createDivisionMembershipTypeSchema,
} from './create.schema';
import { revalidatePath } from 'next/cache';

export const createDivisionMembershipType = createAuthenticatedAction(
    'create',
    'division-membership-types',
    createDivisionMembershipTypeSchema,
    async (body, client) => {
        const response = await client.POST('/division-membership-types', {
            // @ts-expect-error: api specs do not include field requirements due to unimplemented function in spec generation package
            body,
        });

        return handleApiResponse(
            response,
            'Failed to create division membership type',
        );
    },
);

export async function createDivisionMembershipTypeFormAction(
    previousState: FormActionState,
    formData: FormData,
) {
    const result = await createFormAction<CreateDivisionMembershipTypeParams>(
        previousState,
        createDivisionMembershipType,
        formData,
        {
            data: {
                type: 'division-membership-types',
            },
        },
        false, // Don't set club_id automatically as it's not on the pivot
    );

    if (result.success) {
        const divisionId = formData.get(
            'relationships[division][divisions]',
        ) as string | null;
        const membershipTypeId = formData.get(
            'relationships[membershipType][membership-types]',
        ) as string | null;

        if (divisionId) {
            revalidatePath(`/admin/divisions/${divisionId}`);
        }

        if (membershipTypeId) {
            revalidatePath(`/admin/membership-types/${membershipTypeId}`);
        }
    }

    return result;
}
