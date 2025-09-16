'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { update } from '../updateAdminResources';
import { ActionState, validateAndRunAction } from '../validateForm';
import { TranslationSchema } from '@/types/jsonapi-models';

const updateMembershipTypeSchema = z.object({
    titleTranslations: TranslationSchema,
    descriptionTranslations: TranslationSchema,
    monthlyFee: z.coerce.number().min(0).multipleOf(0.01).meta({ step: 0.01 }),
    admissionFee: z.coerce
        .number()
        .min(0)
        .multipleOf(0.01)
        .meta({ step: 0.01 })
        .optional(),
    minimumNumberOfMonths: z.coerce
        .number()
        .int()
        .min(0)
        .max(24)
        .multipleOf(1)
        .meta({
            step: 1,
            description: 'membership_type:minimum_number_of_months.help',
        }),
    minimumNumberOfMembers: z.coerce.number().int().min(1),
    maximumNumberOfMembers: z.coerce.number().int().min(1),
});

export type UpdateMembershipTypeData = z.infer<
    typeof updateMembershipTypeSchema
>;

export async function getUpdateMembershipTypeSchema() {
    return updateMembershipTypeSchema;
}

export async function updateMembershipType(
    id: string,
    _previousState: ActionState,
    formData: FormData,
) {
    return await validateAndRunAction(
        updateMembershipTypeSchema,
        formData,
        (data) => update('membershipTypes', id, data),
        () => {
            revalidateTag('membershipTypes');
        },
    );
}
