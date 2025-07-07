'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { update } from '../updateAdminResources';
import { ActionState, validateAndRunAction } from '../validateForm';
import { TranslationSchema } from '@/types/jsonapi-models';

const updateDivisionSchema = z.object({
    titleTranslations: TranslationSchema,
});

export type UpdateDivisionData = z.infer<typeof updateDivisionSchema>;

export async function getUpdateDivisionSchema() {
    return updateDivisionSchema;
}

export async function updateDivision(
    id: string,
    _previousState: ActionState,
    formData: FormData,
) {
    return await validateAndRunAction(
        updateDivisionSchema,
        formData,
        (data) => update('divisions', id, data),
        () => {
            revalidateTag('divisions');
        },
    );
}
