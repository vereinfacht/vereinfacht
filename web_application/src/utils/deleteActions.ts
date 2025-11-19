import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import { deleteFinanceAccountFormAction } from '@/actions/financeAccounts/delete';
import { deleteTaxAccountFormAction } from '@/actions/taxAccounts/delete';

const deleteActionMap: Record<
    string,
    (id: string, formData: FormData) => Promise<FormActionState>
> = {
    'finance-accounts': async (id: string, formData: FormData) => {
        return await deleteFinanceAccountFormAction(id, { success: false });
    },
    'tax-accounts': async (id: string, formData: FormData) => {
        return await deleteTaxAccountFormAction(id, { success: false });
    },
    // Add more delete actions here as they're created
    // 'transactions': deleteTransactionFormAction,
    // etc.
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
