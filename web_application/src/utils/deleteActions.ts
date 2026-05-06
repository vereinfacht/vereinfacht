import { deleteDivisionFormAction } from '@/actions/divisions/delete';
import { deleteDivisionMembershipTypeFormAction } from '@/actions/divisionMembershipTypes/delete';
import { deleteFinanceAccountFormAction } from '@/actions/financeAccounts/delete';
import { deleteFinanceContactFormAction } from '@/actions/financeContacts/delete';
import { deleteMemberFormAction } from '@/actions/members/delete';
import { deleteMembershipFormAction } from '@/actions/memberships/delete';
import { deleteMembershipTypeFormAction } from '@/actions/membershipTypes/delete';
import { deleteTaxAccountFormAction } from '@/actions/taxAccounts/delete';
import { deleteUserFormAction } from '@/actions/users/delete';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';

const deleteActionMap: Record<
    string,
    (id: string, formData: FormData) => Promise<FormActionState>
> = {
    'finance-accounts': async (id: string) => {
        return await deleteFinanceAccountFormAction(id, { success: false });
    },
    'tax-accounts': async (id: string) => {
        return await deleteTaxAccountFormAction(id, { success: false });
    },
    users: async (id: string) => {
        return await deleteUserFormAction(id, { success: false });
    },
    divisions: async (id: string) => {
        return await deleteDivisionFormAction(id, { success: false });
    },
    members: async (id: string) => {
        return await deleteMemberFormAction(id, { success: false });
    },
    memberships: async (id: string) => {
        return await deleteMembershipFormAction(id, { success: false });
    },
    'finance-contacts': async (id: string) => {
        return await deleteFinanceContactFormAction(id, { success: false });
    },
    'membership-types': async (id: string) => {
        return await deleteMembershipTypeFormAction(id, { success: false });
    },
    'division-membership-types': async (id: string) => {
        return await deleteDivisionMembershipTypeFormAction(id, {
            success: false,
        });
    },
};

export function createDeleteFormAction(resourceName: string) {
    const deleteHandler = deleteActionMap[resourceName];

    if (!deleteHandler) {
        return undefined;
    }

    return async (formData: FormData): Promise<FormActionState> => {
        const id = formData.get('id') as string;

        if (!id) {
            return {
                success: false,
                errors: { id: ['ID is required for deletion'] },
            };
        }

        return await deleteHandler(id, formData);
    };
}
