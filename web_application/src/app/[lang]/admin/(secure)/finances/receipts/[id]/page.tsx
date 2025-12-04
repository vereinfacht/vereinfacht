import { getReceipt } from '@/actions/receipts/get';
import Text from '@/app/components/Text/Text';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import { TTransactionDeserialized } from '@/types/resources';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import DetailField from '../../../components/Fields/DetailField';
import TransactionsTable from '../../transactions/_components/transactions-table';
import EditButton from '../../../components/EditButton';

interface Props {
    params: ShowPageParams;
}

export default async function ReceiptShowPage({ params }: Props) {
    const receipt = await Promise.all([
        getReceipt({
            id: params.id,
            include: ['transactions', 'media', 'taxAccount.taxAccountChart'],
        }),
    ]);

    if (!receipt) {
        notFound();
    }

    const { t } = createTranslation('receipt');

    const fields = [
        {
            attribute: 'receiptType',
            value: t(`receipt:receipt_type.${receipt[0]?.receiptType}`),
        },
        {
            attribute: 'referenceNumber',
            value: receipt[0]?.referenceNumber,
        },
        {
            attribute: 'bookingDate',
            type: 'date',
            value: receipt[0]?.bookingDate,
        },
        {
            attribute: 'amount',
            type: 'currency',
            value: receipt[0]?.amount,
        },
        {
            attribute: 'taxAccount',
            value:
                receipt[0]?.taxAccount?.accountNumber +
                ' - ' +
                receipt[0]?.taxAccount?.description +
                ' (' +
                receipt[0]?.taxAccount?.taxAccountChart?.title +
                ')',
        },
        {
            attribute: 'media',
            type: 'media',
            value: receipt[0]?.media,
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <EditButton href={`/admin/finances/receipts/edit/${params.id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    // @ts-expect-error: value type of media field is not compatible with detail field value type
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'receipts' as ResourceName}
                        value={field.value}
                    />
                ))}
            </ul>
            {receipt[0]?.transactions ? (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('transaction:title.other')}
                    </Text>
                    <TransactionsTable
                        transactions={
                            receipt[0]
                                ?.transactions as TTransactionDeserialized[]
                        }
                        totalPages={Math.ceil(
                            (receipt[0]?.transactions?.length ?? 0) / 10,
                        )}
                    />
                </>
            ) : null}
        </div>
    );
}
