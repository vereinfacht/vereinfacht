'use client';

import { transactionStatusOptions } from '@/actions/transactions/list.schema';
import Empty from '@/app/components/Empty';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import { TableAction } from '@/app/components/Table/TableAction';
import TextCell from '@/app/components/Table/TextCell';
import {
    Tooltip,
    TooltipContent,
    TooltipPrimitive,
    TooltipProvider,
    TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { ResourceName } from '@/resources/resource';
import { TTransactionDeserialized } from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import { listTransactionSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, CircleDashed } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import TransactionDetailsModal from './transaction-details-modal';

interface TransactionsListProps {
    transactions: TTransactionDeserialized[];
    totalPages: number;
}

export default function TransactionsTable({
    transactions,
    totalPages,
}: TransactionsListProps) {
    const [accountId] = useQueryState('accountId');
    const translationHook = useTranslation();
    const lang = translationHook.lang as SupportedLocale;
    const { t } = translationHook;

    const columns: ColumnDef<TTransactionDeserialized>[] = [
        {
            accessorKey: 'name',
            header: t('transaction:title.label'),
            cell: ({ row }) => <TextCell>{row.getValue('name')}</TextCell>,
        },
        {
            accessorKey: 'description',
            header: t('transaction:purpose.label'),
            cell: ({ row }) => (
                <TextCell truncate>{row.getValue('description')}</TextCell>
            ),
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
            cell: ({ row }) => {
                const status = row.getValue('status');
                const statusDescription = t(
                    'transaction:status.description.' + status,
                );
                const tooltipId = `status-tooltip-${row.id}`;

                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger
                                asChild
                                className="cursor-help"
                                aria-describedby={tooltipId}
                            >
                                {status === 'incompleted' ? (
                                    <CircleDashed className="text-slate-500" />
                                ) : status === 'pending' ? (
                                    <CircleDashed className="text-yellow-500" />
                                ) : (
                                    <CircleCheck className="text-green-500" />
                                )}
                            </TooltipTrigger>
                            <TooltipContent role="tooltip" id={tooltipId}>
                                {statusDescription}
                                <TooltipPrimitive.Arrow
                                    fill="white"
                                    width={11}
                                    height={5}
                                />
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
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
            header: ({ column }) => (
                <HeaderSort
                    parser={listTransactionSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('transaction:amount.label')}
                />
            ),
            cell: ({ row }) => <CurrencyCell value={row.getValue('amount')} />,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <TableAction
                    type="view"
                    onClick={() => openTransactionDetails(row.original)}
                />
            ),
        },
    ];

    const [selectedTransaction, setSelectedTransaction] =
        useState<TTransactionDeserialized | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openTransactionDetails = (transaction: TTransactionDeserialized) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

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
                canEdit={true}
                canView={false}
                defaultColumn={{
                    size: 150,
                    enableResizing: false,
                }}
            />
            {selectedTransaction && (
                <TransactionDetailsModal
                    transaction={selectedTransaction}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </>
    );
}
