'use client';

import BelongsToCell from '@/app/components/Table/BelongsToCell';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { TDivisionMembershipTypeDeserialized } from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    divisionMembershipTypes: TDivisionMembershipTypeDeserialized[];
}

export default function DivisionMembershipTypesTable({
    divisionMembershipTypes,
}: Props) {
    const { t, lang } = useTranslation();
    const deleteAction = createDeleteFormAction('division-membership-types');

    const columns: ColumnDef<TDivisionMembershipTypeDeserialized>[] = [
        {
            id: 'division',
            header: t('division:title.label', { count: 1 }),
            cell: ({ row }) => {
                return (
                    <BelongsToCell
                        resource={row.original.division}
                        content={
                            row.original.division?.titleTranslations?.[lang]
                        }
                        path={'/admin/divisions'}
                    />
                );
            },
        },
        {
            accessorKey: 'monthlyFee',
            header: () => (
                <div className="text-right">
                    {t('membership_type:monthly_fee.label')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <CurrencyCell value={row.original.monthlyFee as number} />
                );
            },
        },
    ];

    return (
        <DataTable
            data={divisionMembershipTypes}
            columns={columns}
            resourceName={'divisionMembershipTypes'}
            totalPages={1}
            canEdit={false}
            canView={false}
            deleteAction={deleteAction}
        />
    );
}
