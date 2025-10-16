'use client';

import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { Badge } from '@/app/components/ui/badge';
import { ResourceName } from '@/resources/resource';
import { TStatementDeserialized } from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import { listStatementSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import { Receipt } from 'lucide-react';
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
            accessorKey: 'transactions',
            header: () => (
                <span className={accountId !== null ? 'text-slate-900' : ''}>
                    {t('transaction:type.label')}
                </span>
            ),
            cell: ({ row }) => {
                const transactionCount =
                    (row.getValue('transactions') as any[])?.length || 0;
                return (
                    <div className="relative block w-fit">
                        {transactionCount > 1 ? (
                            <>
                                <Badge
                                    variant="primary"
                                    className="bg-sky-200 text-slate-800"
                                >
                                    {t('transaction:type.collective')}
                                </Badge>
                                <Badge
                                    className="absolute right-[-8px] top-[-12px] flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-semibold"
                                    variant="primary"
                                >
                                    {transactionCount}
                                </Badge>
                            </>
                        ) : (
                            <Badge
                                variant="secondary"
                                className="bg-indigo-200 text-slate-800"
                            >
                                {t('transaction:type.individual')}
                            </Badge>
                        )}
                    </div>
                );
            },
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
            accessorKey: 'amount',
            header: t('transaction:amount.label'),
            cell: ({ row }) => <CurrencyCell value={row.getValue('amount')} />,
        },
    ];

    return (
        <>
            <DataTable
                data={statements}
                columns={columns}
                resourceName={'finances/statements' as ResourceName}
                totalPages={totalPages}
                canEdit={(statement) =>
                    statement.financeAccount?.accountType === 'cash_box'
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
