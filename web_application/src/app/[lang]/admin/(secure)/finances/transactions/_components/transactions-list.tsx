'use client';

import Empty from '@/app/components/Empty';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import HeaderSort from '@/app/components/Table/HeaderSort';
import { TableAction } from '@/app/components/Table/TableAction';
import TablePagination from '@/app/components/Table/TablePagination';
import TextCell from '@/app/components/Table/TextCell';
import Text from '@/app/components/Text/Text';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { TTransactionDeserialized } from '@/types/resources';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import { listTransactionSearchParams } from '@/utils/search-params';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import TransactionDetailsModal from './transaction-details-modal';

interface TransactionsListProps {
    transactions: TTransactionDeserialized[];
    totalPages: number;
}

export default function TransactionsList({
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

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        defaultColumn: {
            size: 150,
            enableResizing: false,
        },
    });

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
        <div className="flex flex-col">
            <div className="overflow-scroll rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: `${header.getSize()}px`,
                                            }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <Text preset="label">
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                </Text>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    data-cy={`transaction-table-row-${row.id}`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            suppressHydrationWarning
                                            data-cy={`transaction-table-cell-${cell.id}`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {selectedTransaction && (
                <TransactionDetailsModal
                    transaction={selectedTransaction}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
            <TablePagination totalPages={totalPages} />
        </div>
    );
}
