'use client';

import { DataTable } from '@/app/components/Table/DataTable';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TStatementDeserialized } from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import { listStatementSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import { useQueryState } from 'nuqs';

interface StatementsListProps {
    statements: TStatementDeserialized[];
    totalPages: number;
}

export default function StatementsTable({
    statements,
    totalPages,
}: StatementsListProps) {
    const [accountId] = useQueryState('accountId');
    const translationHook = useTranslation();
    const lang = translationHook.lang as SupportedLocale;
    const { t } = translationHook;
    console.log('statements', statements);
    const columns: ColumnDef<TStatementDeserialized>[] = [
        {
            accessorKey: 'identifier',
            header: t('transaction:identifier.label'),
            cell: ({ row }) => (
                <TextCell>{row.getValue('identifier')}</TextCell>
            ),
        },
        {
            accessorKey: 'date',
            header: ({ column }) => (
                <HeaderSort
                    parser={listStatementSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('transaction:date.label')}
                />
            ),
            cell: ({ row }) => (
                <TextCell>
                    {formatDate(row.getValue('date'), lang, 'dd.MM.yyyy')}
                </TextCell>
            ),
        },
        {
            accessorKey: 'financeAccount.title',
            header: () => (
                <span className={accountId !== null ? 'text-slate-900' : ''}>
                    {t('finance_account:title.one')}
                </span>
            ),
            cell: ({ row }) => (
                <TextCell>{row.getValue('financeAccount_title')}</TextCell>
            ),
        },
        {
            accessorKey: 'transactions',
            header: () => (
                <span className={accountId !== null ? 'text-slate-900' : ''}>
                    {t('transaction:title.other')}
                </span>
            ),
            cell: ({ row }) => (
                <TextCell>
                    {(Array.isArray(row.getValue('transactions'))
                        ? (row.getValue('transactions') as { id: string }[])
                        : []
                    )
                        .map((transaction) => transaction.id)
                        .join(', ')}
                </TextCell>
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={statements}
                columns={columns}
                resourceName={'finances/transactions' as ResourceName}
                totalPages={totalPages}
                canEdit={(statement) =>
                    statement.financeAccount?.accountType === 'cash_box'
                }
                canView={false}
                defaultColumn={{
                    size: 150,
                    enableResizing: false,
                }}
            />
        </>
    );
}
