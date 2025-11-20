import { getTaxAccount } from '@/actions/taxAccounts/get';
import { updateTaxAccountFormAction } from '@/actions/taxAccounts/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const taxAccount = await getTaxAccount({
        id,
    });
    const extendedAction = updateTaxAccountFormAction.bind(null, id);

    if (!taxAccount) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={taxAccount} />;
}
