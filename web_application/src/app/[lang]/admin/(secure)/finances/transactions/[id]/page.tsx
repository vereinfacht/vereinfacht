import { getTransaction } from '@/actions/transactions/get';
import Text from '@/app/components/Text/Text';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import { TReceiptDeserialized } from '@/types/resources';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import DetailField from '../../../components/Fields/DetailField';
import ReceiptsTable from '../../receipts/_components/receipts-table';
import BelongsToField from '../../../components/Fields/Detail/BelongsToField';

interface Props {
    params: ShowPageParams;
}

export default async function TransactionShowPage({ params }: Props) {
    const transaction = await Promise.all([
        getTransaction({
            id: params.id,
            include: ['statement', 'statement.financeAccount', 'receipts'],
        }),
    ]);

    if (!transaction) {
        notFound();
    }

    const { t } = createTranslation('');

    const fields = [
        {
            attribute: 'title',
            value: transaction[0]?.name,
        },
        {
            attribute: 'financeAccount',
            label: t('finance_account:title.one'),
            value: transaction[0]?.statement?.financeAccount?.title,
        },
        {
            attribute: 'description',
            value: transaction[0]?.description,
        },
        {
            attribute: 'bankIban',
            value: transaction[0]?.bankIban,
            label: t('membership:bank_iban.label'),
        },
        {
            attribute: 'bankAccountHolder',
            value: transaction[0]?.bankAccountHolder,
            label: t('membership:bank_account_holder.label'),
        },
        {
            attribute: 'amount',
            type: 'currency',
            value: transaction[0]?.amount,
        },
        {
            attribute: 'valuedAt',
            type: 'date',
            value: transaction[0]?.valuedAt,
        },
        {
            attribute: 'bookedAt',
            type: 'date',
            value: transaction[0]?.bookedAt,
        },
        {
            attribute: 'statement',
            type: 'belongsTo',
            fields: [
                {
                    label: 'statement:date.label',
                    attribute: 'date',
                    type: 'date',
                },
            ],
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => {
                    if ('type' in field && field.type === 'belongsTo') {
                        return (
                            // @ts-expect-error: reusing this component for now without fixing types for non-resource-class objects
                            <BelongsToField
                                key={index}
                                viewRoute={'/finances/statements'}
                                {...field}
                                type="belongsTo"
                                value={{
                                    id: transaction[0]?.statement?.id,
                                    date: transaction[0]?.statement?.date,
                                }}
                            />
                        );
                    }

                    return (
                        <DetailField
                            key={index}
                            {...field}
                            resourceName={'transactions' as ResourceName}
                            value={field.value}
                        />
                    );
                })}
            </ul>
            {transaction[0]?.receipts ? (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('receipt:title.other')}
                    </Text>
                    <ReceiptsTable
                        receipts={
                            transaction[0]?.receipts as TReceiptDeserialized[]
                        }
                        totalPages={Math.ceil(
                            (transaction[0]?.receipts?.length ?? 0) / 10,
                        )}
                    />
                </>
            ) : null}
        </div>
    );
}
