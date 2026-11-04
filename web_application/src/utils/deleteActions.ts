import { deleteDivisionFormAction } from '@/actions/divisions/delete';
import { deleteDivisionMembershipTypeFormAction } from '@/actions/divisionMembershipTypes/delete';
import { deleteFinanceAccountFormAction } from '@/actions/financeAccounts/delete';
import { deleteFinanceContactFormAction } from '@/actions/financeContacts/delete';
import { deleteMemberFormAction } from '@/actions/members/delete';
import { deleteMembershipFormAction } from '@/actions/memberships/delete';
import { deleteMembershipTypeFormAction } from '@/actions/membershipTypes/delete';
import { deleteTaxAccountFormAction } from '@/actions/taxAccounts/delete';
import { deleteUserFormAction } from '@/actions/users/delete';
import type { FormActionState } from '@/types/form-actions';

const deleteActionMap: Record<
    string,
    (id: string, previousState: FormActionState) => Promise<FormActionState>
> = {
    'finance-accounts': async (id, previousState) => {
        return await deleteFinanceAccountFormAction(id, previousState);
    },
    'tax-accounts': async (id, previousState) => {
        return await deleteTaxAccountFormAction(id, previousState);
    },
    users: async (id, previousState) => {
        return await deleteUserFormAction(id, previousState);
    },
    divisions: async (id, previousState) => {
        return await deleteDivisionFormAction(id, previousState);
    },
    members: async (id, previousState) => {
        return await deleteMemberFormAction(id, previousState);
    },
    memberships: async (id, previousState) => {
        return await deleteMembershipFormAction(id, previousState);
    },
    'finance-contacts': async (id, previousState) => {
        return await deleteFinanceContactFormAction(id, previousState);
    },
    'membership-types': async (id, previousState) => {
        return await deleteMembershipTypeFormAction(id, previousState);
    },
    'division-membership-types': async (id, previousState) => {
        return await deleteDivisionMembershipTypeFormAction(id, previousState);
    },
};

export function createDeleteFormAction(resourceName: string) {
    const deleteHandler = deleteActionMap[resourceName];

    if (!deleteHandler) {
        return undefined;
    }

    return async (
        previousState: FormActionState,
        formData: FormData,
    ): Promise<FormActionState> => {
        const id = formData.get('id');

        if (typeof id !== 'string' || id.length === 0) {
            return {
                success: false,
                errors: { id: ['ID is required for deletion'] },
            };
        }

        return await deleteHandler(id, previousState);
    };
}
