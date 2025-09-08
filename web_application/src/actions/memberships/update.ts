'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { update } from '../updateAdminResources';
import { ActionState, validateAndRunAction } from '../validateForm';
import { ibanSchema } from '../financeAccounts/create.schema';

const updateMembershipSchema = z.object({
    bankIban: ibanSchema,
    bankAccountHolder: z.string().min(2).max(255),
    startedAt: z.coerce.date(),
    endedAt: z.coerce.date().optional().or(z.literal('')),
    status: z.enum(['active', 'applied', 'cancelled']),
});

export type UpdateMembershipData = z.infer<typeof updateMembershipSchema>;

export async function getUpdateMembershipSchema() {
    return updateMembershipSchema;
}

export async function updateMembership(
    id: string,
    _previousState: ActionState,
    formData: FormData,
) {
    return await validateAndRunAction(
        updateMembershipSchema,
        formData,
        (data) => update('memberships', id, data),
        () => {
            revalidateTag('memberships');
        },
    );
}
