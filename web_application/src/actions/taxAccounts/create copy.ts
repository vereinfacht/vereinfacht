'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import createFormAction from '@/actions/base/create';
import { ApiEndpoints } from '@/services/api-endpoints';
import { revalidatePath } from 'next/cache';
import { CreateDivisionMembershipTypeParams } from './create.schema';

export async function attachDivisionToMembershipType(
    _previousState: FormActionState,
    formData: FormData,
): Promise<FormActionState> {
    return createFormAction<CreateDivisionMembershipTypeParams>(
        _previousState,
        async (payload) => {
            const api = new ApiEndpoints();
            const response = await api.createDivisionMembershipType(payload);

            const divisionId = (payload as any).data.relationships.division.data
                .id;
            const membershipTypeId = (payload as any).data.relationships
                .membershipType.data.id;

            revalidatePath(`/admin/divisions/${divisionId}`);
            revalidatePath(`/admin/membership-types/${membershipTypeId}`);

            return response;
        },
        formData,
        {
            data: {
                type: 'division-membership-types',
            },
        },
        false,
    );
}
