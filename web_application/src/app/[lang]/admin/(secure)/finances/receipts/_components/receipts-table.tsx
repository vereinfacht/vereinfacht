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
import {
    Tooltip,
    TooltipContent,
    TooltipPrimitive,
    TooltipProvider,
    TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { ResourceName } from '@/resources/resource';
import {
    TFinanceContactDeserialized,
    TReceiptDeserialized,
} from '@/types/resources';
import { listReceiptSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import {
    Building2,
    CircleCheck,
    CircleDashed,
    CircleUserRound,
} from 'lucide-react';
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
    const columns: ColumnDef<TReceiptDeserialized>[] = [
        {
            accessorKey: 'type',
            header: ({ column }) =>
                extended ? (
                    <HeaderOptionFilter
                        options={receiptTypeOptions ?? []}
                        parser={listReceiptSearchParams.type}
                        paramKey={column.id}
                        translationKey={'receipt:type'}
                    />
                ) : (
                    t('receipt:type.label')
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
            header: ({ column }) =>
                extended ? (
                    <HeaderSort
                        parser={listReceiptSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('receipt:document_date.label')}
                    />
                ) : (
                    t('receipt:document_date.label')
                ),
            cell: ({ row }) => (
                <DateField value={row.getValue('documentDate')} />
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
            cell: ({ row }) => {
                const status = row.getValue('status');
                const statusDescription = t(
                    'receipt:status.description.' + status,
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
                                    <CircleDashed className="text-slate-600" />
                                ) : (
                                    <CircleCheck className="text-green-600" />
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
