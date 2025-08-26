import { getReceipt } from '@/actions/receipts/get';
import { EditPageParams } from '@/types/params';
import { notFound } from 'next/navigation';

interface Props {
    params: EditPageParams;
}

export default async function EditReceiptPage({ params }: Props) {
    const receipt = await getReceipt({ id: params.id });

    if (!receipt) {
        notFound();
    }

    return <div>Edit form for: {receipt.referenceNumber}</div>;
}
