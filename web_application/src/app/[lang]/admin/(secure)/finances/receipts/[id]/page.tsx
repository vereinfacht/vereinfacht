import { getReceipt } from '@/actions/receipts/get';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import DetailField from '../../../components/Fields/DetailField';

interface Props {
    params: ShowPageParams;
}

export default async function ReceiptShowPage({ params }: Props) {
    const receipt = await Promise.all([
        getReceipt({
            id: params.id,
        }),
    ]);

    if (!receipt) {
        notFound();
    }

    const fields = [
        {
            attribute: 'type',
        },
        {
            attribute: 'referenceNumber',
        },
        {
            attribute: 'document_date',
            type: 'date',
            value: receipt[0]?.documentDate,
        },
        {
            attribute: 'amount',
            type: 'currency',
            value: receipt[0]?.amount,
        },
    ];

    return (
        <div className="container flex flex-col gap-12">
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'receipts' as ResourceName}
                        value={field.value ?? receipt[0]?.[field.attribute]}
                    />
                ))}
            </ul>
        </div>
    );
}
