import { deleteDivisionFormAction } from '@/actions/divisions/delete';
import { deleteFinanceAccountFormAction } from '@/actions/financeAccounts/delete';
import { deleteTaxAccountFormAction } from '@/actions/taxAccounts/delete';
import { deleteUserFormAction } from '@/actions/users/delete';
import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { ResourceName } from '@/resources/resource';

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
};

export function createDeleteFormAction(resourceName: ResourceName) {
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
