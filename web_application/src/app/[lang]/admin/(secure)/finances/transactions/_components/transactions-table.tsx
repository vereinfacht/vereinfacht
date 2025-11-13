'use client';

import { transactionStatusOptions } from '@/actions/transactions/list.schema';
import Empty from '@/app/components/Empty';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import StatusCell from '@/app/components/Table/StatusCell';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TTransactionDeserialized } from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import { listTransactionSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';

interface TransactionsListProps {
    transactions: TTransactionDeserialized[];
    totalPages: number;
}

export default function TransactionsTable({
    transactions,
    totalPages,
}: TransactionsListProps) {
    const translationHook = useTranslation();
    const lang = translationHook.lang as SupportedLocale;
    const { t } = translationHook;

    const columns: ColumnDef<TTransactionDeserialized>[] = [
        {
            accessorKey: 'title',
            header: t('transaction:title.label'),
            cell: ({ row }) => <TextCell>{row.getValue('title')}</TextCell>,
        },
        {
            accessorKey: 'description',
            header: t('transaction:description.label'),
            cell: ({ row }) => (
                <TextCell truncate>{row.getValue('description')}</TextCell>
            ),
        },
        {
            accessorKey: 'bankIban',
            header: t('transaction:iban.label'),
            cell: ({ row }) => <TextCell>{row.getValue('bankIban')}</TextCell>,
        },
        {
            accessorKey: 'valuedAt',
            header: ({ column }) => (
                <HeaderSort
                    parser={listTransactionSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('transaction:valued_at.label')}
                />
            ),
            cell: ({ row }) => (
                <TextCell>
                    {formatDate(row.getValue('valuedAt'), lang, 'dd.MM.yyyy')}
                </TextCell>
            ),
        },
        {
            accessorKey: 'bookedAt',
            header: ({ column }) => (
                <HeaderSort
                    parser={listTransactionSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('transaction:booked_at.label')}
                />
            ),
            cell: ({ row }) => (
                <TextCell>
                    {formatDate(row.getValue('bookedAt'), lang, 'dd.MM.yyyy')}
                </TextCell>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <HeaderOptionFilter
                    options={transactionStatusOptions ?? []}
                    parser={listTransactionSearchParams.status}
                    paramKey={column.id}
                    translationKey={'transaction:status'}
                />
            ),
            cell: ({ row }) => (
                <StatusCell
                    status={row.getValue('status')}
                    rowId={row.id}
                    translateNamespace={'transaction'}
                />
            ),
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => (
                <HeaderSort
                    parser={listTransactionSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('transaction:amount.label')}
                />
            ),
            cell: ({ row }) => <CurrencyCell value={row.getValue('amount')} />,
        },
    ];

    if (transactions.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Empty
                    text={t('resource:no_resources_found', {
                        name: t('transaction:title.other'),
                    })}
                />
            </div>
        );
    }

    return (
        <>
            <DataTable
                data={transactions}
                columns={columns}
                resourceName={'finances/transactions' as ResourceName}
                totalPages={totalPages}
                canEdit={(transaction) =>
                    transaction.statement?.financeAccount?.accountType ===
                    'cash_box'
                }
                canView={true}
                defaultColumn={{
                    size: 150,
                    enableResizing: false,
                }}
            />
        </>
    );
}
