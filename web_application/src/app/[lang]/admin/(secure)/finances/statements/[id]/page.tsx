import { getStatement } from '@/actions/statements/get';
import Text from '@/app/components/Text/Text';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import { TTransactionDeserialized } from '@/types/resources';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import DetailField from '../../../components/Fields/DetailField';
import TransactionsTable from '../../transactions/_components/transactions-table';

interface Props {
    params: ShowPageParams;
}

export default async function StatementShowPage({ params }: Props) {
    const statement = await Promise.all([
        getStatement({
            id: params.id,
            include: ['transactions.receipts', 'financeAccount'],
        }),
    ]);

    if (!statement) {
        notFound();
    }

    const { t } = createTranslation('transaction');

    const fields = [
        {
            attribute: 'title',
            value: statement[0]?.title,
        },
        {
            attribute: 'date',
            type: 'date',
            value: statement[0]?.date,
        },
        {
            attribute: 'financeAccount',
            value: statement[0]?.financeAccount?.title,
            label: t('finance_account:title.one'),
        },
        {
            attribute: 'amount',
            type: 'currency',
            value: statement[0]?.amount,
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'statements' as ResourceName}
                        value={field.value}
                    />
                ))}
            </ul>
            {statement[0]?.transactions ? (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('transaction:title.other')}
                    </Text>
                    <TransactionsTable
                        transactions={
                            statement[0]
                                ?.transactions as TTransactionDeserialized[]
                        }
                        totalPages={Math.ceil(
                            (statement[0]?.transactions?.length ?? 0) / 10,
                        )}
                    />
                </>
            ) : null}
        </div>
    );
}
