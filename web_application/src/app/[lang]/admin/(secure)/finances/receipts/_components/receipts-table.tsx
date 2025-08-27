'use client';

import {
    receiptStatusOptions,
    receiptTypeOptions,
} from '@/actions/receipts/list.schema';
import BelongsToCell from '@/app/components/Table/BelongsToCell';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import {
    TFinanceContactDeserialized,
    TReceiptDeserialized,
} from '@/types/resources';
import { listReceiptSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, CircleUserRound } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import DateField from '../../../components/Fields/Detail/DateField';

interface Props {
    receipts: TReceiptDeserialized[];
    totalPages: number;
    extended?: boolean;
}

export default function ReceiptsTable({
    receipts,
    totalPages,
    extended = false,
}: Props) {
    const { t } = useTranslation();
    console.log(receipts[0].financeContact);
    const columns: ColumnDef<TReceiptDeserialized>[] = [
        {
            accessorKey: 'type',
            header: ({ column }) => (
                <HeaderOptionFilter
                    options={receiptTypeOptions ?? []}
                    parser={listReceiptSearchParams.type}
                    paramKey={column.id}
                    translationKey={'receipt:type'}
                />
            ),
            cell: ({ row }) => (
                <TextCell>{t('receipt:type.' + row.getValue('type'))}</TextCell>
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
            accessorKey: 'documentDate',
            header: ({ column }) => (
                <HeaderSort
                    parser={listReceiptSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('receipt:document_date.label')}
                />
            ),
            cell: ({ row }) => (
                <DateField value={row.getValue('documentDate')} />
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <HeaderOptionFilter
                    options={receiptStatusOptions ?? []}
                    parser={listReceiptSearchParams.status}
                    paramKey={column.id}
                    translationKey={'receipt:status'}
                />
            ),
            cell: ({ row }) => {
                const status = row.getValue('status');
                return <TextCell>{t('receipt:status.' + status)}</TextCell>;
            },
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => (
                <HeaderSort
                    parser={listReceiptSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('receipt:amount.label')}
                />
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
                        id={financeContact.id}
                        content={
                            financeContact.companyName ? (
                                <>
                                    <Building2 /> {financeContact.companyName}
                                </>
                            ) : (
                                <>
                                    {<CircleUserRound />}{' '}
                                    {financeContact.fullName ?? ''}
                                </>
                            )
                        }
                        path={'/admin/finances/contacts'}
                    />
                );
            },
        };

        columns.splice(columns.length - 1, 0, financeContactColumn);
    }

    return (
        <DataTable
            data={receipts}
            columns={columns}
            resourceName={'finances/receipts' as ResourceName}
            totalPages={totalPages}
            canEdit={true}
            canView={true}
        />
    );
}
