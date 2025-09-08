import { getReceipt } from '@/actions/receipts/get';
import { updateReceiptFormAction } from '@/actions/receipts/update';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import CreateForm from '../../_components/create-form';

interface Props {
    params: EditPageParams;
}

export default async function Page({ params }: Props) {
    const { id } = params;
    const receipt = await getReceipt({ id });
    const extendedAction = updateReceiptFormAction.bind(null, id);

    if (!receipt) {
        notFound();
    }

    return <CreateForm action={extendedAction} data={receipt} />;
}
