'use server';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import updateFormAction from '../base/update';
import { update } from '../updateAdminResources';
import { ActionState, validateAndRunAction } from '../validateForm';
import { ibanSchema } from '../financeAccounts/create.schema';
import {
    UpdateMembershipParams,
    updateMembershipSchema,
} from './update.schema';

const legacyUpdateMembershipSchema = z.object({
    bankIban: ibanSchema,
    bankAccountHolder: z.string().min(2).max(255),
    startedAt: z.coerce.date(),
    endedAt: z.coerce.date().optional().or(z.literal('')),
    status: z.enum(['active', 'applied', 'cancelled']),
});

export type UpdateMembershipData = z.infer<typeof legacyUpdateMembershipSchema>;

export const updateMembershipApi = createAuthenticatedAction(
    'update',
    'memberships',
    updateMembershipSchema,
    async (body, client) => {
        const response = await client.PATCH('/memberships/{membership}', {
            params: {
                path: { membership: body.data.id },
            },
            // @ts-expect-error: path exists in backend but generated schema may lag
            body,
        });

        return handleApiResponse(response, 'Failed to update membership');
    },
);

export async function updateMembershipFormAction(
    id: string,
    previousState: FormActionState,
    formData: FormData,
) {
    return await updateFormAction<UpdateMembershipParams>(
        previousState,
        updateMembershipApi,
        formData,
        {
            data: {
                id,
                type: 'memberships',
            },
        },
    );
}

export async function getUpdateMembershipSchema() {
    return legacyUpdateMembershipSchema;
}

export async function updateMembership(
    id: string,
    _previousState: ActionState,
    formData: FormData,
) {
    return await validateAndRunAction(
        legacyUpdateMembershipSchema,
        formData,
        (data) => update('memberships', id, data),
        () => {
            revalidateTag('memberships');
        },
    );
}
