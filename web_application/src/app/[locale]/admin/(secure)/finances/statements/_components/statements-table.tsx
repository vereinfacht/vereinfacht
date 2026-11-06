'use client';
import { useTranslations, useLocale } from 'next-intl';

import { statementTypeOptions } from '@/actions/statements/list.schema';
import BadgeCount from '@/app/components/Table/BadgeCount';
import BelongsToCell from '@/app/components/Table/BelongsToCell';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { Badge } from '@/app/components/ui/badge';
import { ResourceName } from '@/resources/resource';
import { TStatementDeserialized } from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { listStatementSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryState } from 'nuqs';
import IconCircleDashed from '/public/svg/no-assignments.svg';
import IconCircleDotDashed from '/public/svg/incomplete.svg';
import IconCircleCheck from '/public/svg/check-circle.svg';

interface StatementsListProps {
    statements: TStatementDeserialized[];
    totalPages: number;
}

export default function StatementsTable({
    statements,
    totalPages,
}: StatementsListProps) {
    const [accountId] = useQueryState('accountId');
    const t = useTranslations();
    const locale = useLocale();

    const columns: ColumnDef<TStatementDeserialized>[] = [
        {
            accessorKey: 'title',
            header: t('statement.title.label'),
            meta: {
                mobileLabel: t('statement.title.label'),
            } as any,
            cell: ({ row }) => {
                const statement = row.original as TStatementDeserialized;

                return (
                    <BelongsToCell
                        resource={statement}
                        path="/admin/finances/statements"
                        content={statement.title}
                        truncate
                    />
                );
            },
        },
        {
            accessorKey: 'transactions',
            meta: {
                mobileLabel: t('statement.type.label'),
            } as any,
            header: () => (
                <HeaderOptionFilter
                    options={statementTypeOptions ?? []}
                    parser={listStatementSearchParams.statementType}
                    paramKey={'statementType'}
                    translationKey={'statement.type'}
                />
            ),
            cell: ({ row }) => {
                const transactionCount =
                    (row.getValue('transactions') as any[])?.length || 0;
                return (
                    <div className="relative block w-fit">
                        {row.original.statementType === 'collective' ? (
                            <>
                                <Badge
                                    variant="primary"
                                    className="bg-sky-200 text-slate-800 hover:bg-sky-200"
                                >
                                    {t('statement.type.collective')}
                                </Badge>
                                <BadgeCount count={transactionCount} />
                            </>
                        ) : (
                            <Badge
                                variant="secondary"
                                className="bg-indigo-200 text-slate-800 hover:bg-indigo-200"
                            >
                                {t('statement.type.individual')}
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'date',
            meta: {
                mobileLabel: t('statement.date.label'),
            } as any,
            header: ({ column }) => (
                <HeaderSort
                    parser={listStatementSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('statement.date.label')}
                />
            ),
            cell: ({ row }) => (
                <TextCell>
                    {formatDate(row.getValue('date'), locale, 'dd.MM.yyyy')}
                </TextCell>
            ),
        },
        {
            accessorKey: 'status',
            meta: {
                mobileLabel: t('transaction.status.label'),
            } as any,
            header: t('transaction.status.label'),
            cell: ({ row }) => {
                const status = row.getValue<string | null>('status');

                if (!status) return <TextCell>–</TextCell>;

                return (
                    <Badge
                        variant={
                            status === 'completed'
                                ? 'success'
                                : status === 'incompleted'
                                  ? 'warning'
                                  : 'muted'
                        }
                        icon={
                            status === 'completed' ? (
                                <IconCircleCheck />
                            ) : status === 'incompleted' ? (
                                <IconCircleDotDashed />
                            ) : (
                                <IconCircleDashed />
                            )
                        }
                    >
                        {t(`transaction.status.${status}`)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'financeAccount.title',
            meta: {
                mobileLabel: t('finance_account.title.one'),
            } as any,
            header: () => (
                <span className={accountId !== null ? 'text-slate-900' : ''}>
                    {t('finance_account.title.one')}
                </span>
            ),
            cell: ({ row }) => (
                <TextCell>{row.getValue('financeAccount_title')}</TextCell>
            ),
        },
        {
            accessorKey: 'amount',
            meta: {
                mobileLabel: t('statement.amount.label'),
            } as any,
            header: ({ column }) => (
                <HeaderSort
                    parser={listStatementSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('statement.amount.label')}
                />
            ),
            cell: ({ row }) => <CurrencyCell value={row.getValue('amount')} />,
        },
    ];

    return (
        <DataTable
            className="w-full"
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
    );
}
