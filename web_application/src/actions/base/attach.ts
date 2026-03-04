'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import createFormAction from '@/actions/base/create';
import { ApiEndpoints } from '@/services/api-endpoints';
import { revalidatePath } from 'next/cache';

export interface AttachParams {
    pivotType: string;
    relationships: Record<string, string>;
    revalidatePaths: string[];
}

export async function attachRelationAction(
    params: AttachParams,
    _previousState: FormActionState,
    formData: FormData,
): Promise<FormActionState> {
    return createFormAction(
        _previousState,
        async (payload) => {
            const api = new ApiEndpoints();
            const response = await api.createResource(
                params.pivotType,
                payload,
                params.relationships,
            );

            params.revalidatePaths.forEach((path) => revalidatePath(path));

            return response;
        },
        formData,
        {
            data: {
                type: params.pivotType,
            },
        },
        false,
    );
}
