import { getTransaction } from '@/actions/transactions/get';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import BelongsToField from '../../../components/Fields/Detail/BelongsToField';
import DetailField from '../../../components/Fields/DetailField';

interface Props {
    params: ShowPageParams;
}

export default async function TransactionShowPage({ params }: Props) {
    const transaction = await Promise.all([
        getTransaction({
            id: params.id,
            include: ['statement', 'statement.financeAccount', 'receipt'],
        }),
    ]);

    if (!transaction) {
        notFound();
    }

    const { t } = createTranslation('');

    const fields = [
        {
            attribute: 'title',
            value: transaction[0]?.title,
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
        {
            attribute: 'receipt',
            type: 'belongsTo',
            fields: [
                {
                    label: 'receipt:reference_number.label',
                    attribute: 'referenceNumber',
                    type: 'string',
                },
            ],
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => {
                    if (
                        'type' in field &&
                        field.type === 'belongsTo' &&
                        field.attribute === 'statement'
                    ) {
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

                    if (
                        'type' in field &&
                        field.type === 'belongsTo' &&
                        field.attribute === 'receipt'
                    ) {
                        return (
                            // @ts-expect-error: reusing this component for now without fixing types for non-resource-class objects
                            <BelongsToField
                                key={index}
                                viewRoute={'/finances/receipts'}
                                {...field}
                                type="belongsTo"
                                value={{
                                    id: transaction[0]?.receipt?.id,
                                    referenceNumber:
                                        transaction[0]?.receipt
                                            ?.referenceNumber,
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
        </div>
    );
}
