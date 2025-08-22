'use client';

import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import TextCell from '@/app/components/Table/TextCell';
import Text from '@/app/components/Text/Text';
import { ResourceName } from '@/resources/resource';
import { TReceiptDeserialized } from '@/types/resources';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    receipts: TReceiptDeserialized[];
    totalPages: number;
}

export default function ReceiptsTable({ receipts }: Props) {
    const { t } = useTranslation('receipt');

    const columns: ColumnDef<TReceiptDeserialized>[] = [
        {
            accessorKey: 'type',
            header: t('type.label'),
            cell: ({ row }) => (
                <TextCell>{t('type.' + row.getValue('type'))}</TextCell>
            ),
        },
        {
            accessorKey: 'name',
            header: t('name.label'),
            cell: ({ row }) => <TextCell>{row.getValue('name')}</TextCell>,
        },
        {
            accessorKey: 'number',
            header: t('number.label'),
            cell: ({ row }) => <TextCell>{row.getValue('number')}</TextCell>,
        },
        {
            accessorKey: 'total_amount',
            header: t('total_amount.label'),
            cell: ({ row }) => (
                <CurrencyCell value={row.getValue('total_amount')} />
            ),
        },
    ];

    return (
        <div>
            <Text className="mb-4">{t('title.other')}</Text>
            <DataTable
                data={receipts as any}
                columns={columns as any}
                resourceName={'receipts' as ResourceName}
            />
        </div>
    );
}
