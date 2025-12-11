'use client';

import {
    receiptStatusOptions,
    receiptTypeOptions,
} from '@/actions/receipts/list.schema';
import BelongsToCell from '@/app/components/Table/BelongsToCell';
import BelongsToManyCell from '@/app/components/Table/BelongsToManyCell';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderDatePicker } from '@/app/components/Table/HeaderDatePicker';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import MediaCell from '@/app/components/Table/MediaCell';
import StatusCell from '@/app/components/Table/StatusCell';
import TextCell from '@/app/components/Table/TextCell';
import { TriStateHeaderFilter } from '@/app/components/Table/TriStateHeaderFilter';
import { ResourceName } from '@/resources/resource';
import {
    TFinanceContactDeserialized,
    TReceiptDeserialized,
    TTransactionDeserialized,
} from '@/types/resources';
import { listReceiptSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, CircleUserRound } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import CreateButton from '../../../components/CreateButton';
import DateField from '../../../components/Fields/Detail/DateField';
import FinancialStatementExportModal from './financial-statement-export-modal';

interface Props {
    receipts: TReceiptDeserialized[];
    allIds?: string[];
    totalPages: number;
    extended?: boolean;
}

export default function ReceiptsTable({
    receipts,
    allIds,
    totalPages,
    extended = false,
}: Props) {
    const { t } = useTranslation();
    const columns: ColumnDef<TReceiptDeserialized>[] = [
        {
            accessorKey: 'receiptType',
            header: ({ column }) =>
                extended ? (
                    <HeaderOptionFilter
                        options={receiptTypeOptions ?? []}
                        parser={listReceiptSearchParams.receiptType}
                        paramKey={column.id}
                        translationKey={'receipt:receipt_type'}
                    />
                ) : (
                    t('receipt:receipt_type.label')
                ),
            cell: ({ row }) => (
                <TextCell>
                    {t('receipt:receipt_type.' + row.getValue('receiptType'))}
                </TextCell>
            ),
        },
        {
            accessorKey: 'referenceNumber',
            header: t('receipt:reference_number.label'),
            cell: ({ row }) => (
                <TextCell>{row.getValue('referenceNumber')}</TextCell>
            ),
        },
        {
            accessorKey: 'bookingDate',
            header: () =>
                extended ? (
                    <HeaderDatePicker
                        fromDateParser={listReceiptSearchParams.bookingDateFrom}
                        toDateParser={listReceiptSearchParams.bookingDateTo}
                        translationKey={'receipt:booking_date'}
                        parameterKeys={{
                            from: 'bookingDateFrom',
                            to: 'bookingDateTo',
                        }}
                    />
                ) : (
                    t('receipt:booking_date.label')
                ),
            cell: ({ row }) => (
                <DateField value={row.getValue('bookingDate')} />
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) =>
                extended ? (
                    <HeaderOptionFilter
                        options={receiptStatusOptions ?? []}
                        parser={listReceiptSearchParams.status}
                        paramKey={column.id}
                        translationKey={'receipt:status'}
                    />
                ) : (
                    t('receipt:status.label')
                ),
            cell: ({ row }) => (
                <StatusCell
                    status={row.getValue('status')}
                    rowId={row.id}
                    translateNamespace={'receipt'}
                />
            ),
        },
        {
            accessorKey: 'media',
            header: () =>
                extended ? (
                    <TriStateHeaderFilter
                        parser={listReceiptSearchParams.media}
                        paramKey="media"
                        translationKey="receipt:media.filter"
                    />
                ) : (
                    t('receipt:media.label')
                ),
            cell: ({ row }) => (
                <MediaCell
                    media={row.getValue('media')}
                    rowId={row.id}
                    rowLink={`/admin/finances/receipts/${row.original.id}`}
                    translateNamespace="receipt"
                />
            ),
        },
        {
            accessorKey: 'amount',
            header: ({ column }) =>
                extended ? (
                    <HeaderSort
                        parser={listReceiptSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('receipt:amount.label')}
                    />
                ) : (
                    t('receipt:amount.label')
                ),
            cell: ({ row }) => <CurrencyCell value={row.getValue('amount')} />,
        },
    ];

    if (extended) {
        const financeContactColumn: ColumnDef<TReceiptDeserialized> = {
            accessorKey: 'financeContact',
            header: t('contact:title.one'),
            cell: (cell) => {
                const financeContact =
                    cell.getValue() as TFinanceContactDeserialized;

                return (
                    <BelongsToCell
                        resource={financeContact}
                        content={
                            financeContact?.companyName ? (
                                <>
                                    <Building2 /> {financeContact?.companyName}
                                </>
                            ) : (
                                <>
                                    <CircleUserRound />
                                    {financeContact?.fullName}
                                </>
                            )
                        }
                        path={'/admin/finances/contacts'}
                    />
                );
            },
        };

        const transactionsColumn: ColumnDef<TTransactionDeserialized> = {
            accessorKey: 'transactions',
            header: t('transaction:title.one'),
            cell: (cell) => {
                const transactions =
                    cell.getValue() as TTransactionDeserialized[];

                return (
                    <BelongsToManyCell
                        items={transactions}
                        basePath="/admin/finances/transactions"
                        parentPath={`/admin/finances/receipts/${cell.row.original.id}`}
                        displayProperty="title"
                    />
                );
            },
        };

        columns.splice(
            columns.length - 2,
            0,
            transactionsColumn as ColumnDef<TReceiptDeserialized>,
            financeContactColumn,
        );
    }

    return (
        <>
            {extended && (
                <div className="flex justify-between">
                    <CreateButton href="/admin/finances/receipts/create" />
                    <FinancialStatementExportModal receiptIds={allIds} />
                </div>
            )}
            <DataTable
                data={receipts}
                columns={columns}
                resourceName={'finances/receipts' as ResourceName}
                totalPages={totalPages}
                canEdit={true}
                canView={true}
            />
        </>
    );
}
