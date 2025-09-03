import { getFinanceContact } from '@/actions/financeContacts/get';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';
import { updateFinanceContactFormAction } from '@/actions/financeContacts/update';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const contact = await getFinanceContact({ id });
    const extendedAction = updateFinanceContactFormAction.bind(null, id);

    if (!contact) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={contact} />;
}
