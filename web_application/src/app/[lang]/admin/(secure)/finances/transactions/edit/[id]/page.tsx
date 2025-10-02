import { getTransaction } from '@/actions/transactions/get';
import { updateTransactionFormAction } from '@/actions/transactions/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const transaction = await getTransaction({
        id,
        include: ['receipts', 'financeAccount'],
    });
    const extendedAction = updateTransactionFormAction.bind(null, id);

    if (!transaction) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={transaction} />;
}
