import { getReceipt } from '@/actions/receipts/get';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';

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

    const { t } = createTranslation('receipt');
    const fields = [
        {
            label: t('type.label'),
            attribute: 'type',
        },
    ];

    return (
        <div className="container flex flex-col gap-12">
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    // @ts-expect-error: value type as element mismatch
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'receipts' as ResourceName}
                        value={receipt[field.attribute as keyof typeof receipt]}
                    />
                ))}
            </ul>
        </div>
    );
}
