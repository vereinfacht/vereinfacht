'use client';

import { receiptTypeOptions } from '@/actions/receipts/list.schema';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { HeaderOptionFilter } from '@/app/components/Table/HeaderOptionFilter';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TReceiptDeserialized } from '@/types/resources';
import { listReceiptSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import DateField from '../../../components/Fields/Detail/DateField';

interface Props {
    receipts: TReceiptDeserialized[];
    totalPages: number;
}

export default function ReceiptsTable({ receipts, totalPages }: Props) {
    const { t } = useTranslation('receipt');

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
                <TextCell>{t('type.' + row.getValue('type'))}</TextCell>
            ),
        },
        {
            accessorKey: 'referenceNumber',
            header: t('reference_number.label'),
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
                    columnTitle={t('document_date.label')}
                />
            ),
            cell: ({ row }) => (
                <DateField value={row.getValue('documentDate')} />
            ),
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => (
                <HeaderSort
                    parser={listReceiptSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('amount.label')}
                />
            ),
            cell: ({ row }) => <CurrencyCell value={row.getValue('amount')} />,
        },
    ];

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
