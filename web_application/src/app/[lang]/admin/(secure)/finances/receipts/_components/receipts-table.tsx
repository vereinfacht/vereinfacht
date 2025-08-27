'use client';

import {
    receiptStatusOptions,
    receiptTypeOptions,
} from '@/actions/receipts/list.schema';
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
import useTranslation from 'next-translate/useTranslation';
import DateField from '../../../components/Fields/Detail/DateField';
import BelongsToField from '../../../components/Fields/Index/BelongsToField';

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
    const { t } = useTranslation('receipt');
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
                return <TextCell>{t('status.' + status)}</TextCell>;
            },
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

    if (extended) {
        const financeContactColumn: ColumnDef<TReceiptDeserialized> = {
            accessorKey: 'financeContact',
            header: t('finance_contact.label'),
            cell: (cell) => {
                const financeContact =
                    cell.getValue() as TFinanceContactDeserialized;
                return (
                    <BelongsToField
                        id={financeContact.id}
                        title={
                            financeContact.companyName ??
                            (financeContact.fullName as string)
                        }
                        resourceName={'financeContacts' as ResourceName}
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
