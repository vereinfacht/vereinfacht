'use client';

import { useState } from 'react';
import BelongsToCell from '@/app/components/Table/BelongsToCell';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { TDivisionMembershipTypeDeserialized } from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import { Edit } from 'lucide-react';
import EditableMonthlyFeeCell from './EditableMonthlyFeeCell';

interface Props {
    divisionMembershipTypes: TDivisionMembershipTypeDeserialized[];
    membershipTypeId: string;
}

export default function DivisionMembershipTypesTable({
    divisionMembershipTypes,
    membershipTypeId,
}: Props) {
    const { t, lang } = useTranslation();
    const deleteAction = createDeleteFormAction('division-membership-types');
    const [editingId, setEditingId] = useState<string | null>(null);

    const columns: ColumnDef<TDivisionMembershipTypeDeserialized>[] = [
        {
            id: 'division',
            header: t('division:title.label', { count: 1 }),
            cell: ({ row }) => (
                <BelongsToCell
                    resource={row.original.division}
                    content={row.original.division?.titleTranslations?.[lang]}
                    path={'/admin/divisions'}
                />
            ),
        },
        {
            accessorKey: 'monthlyFee',
            header: () => (
                <div className="text-right">
                    {t('membership_type:monthly_fee.label')}
                </div>
            ),
            cell: ({ row }) => {
                const isEditing = editingId === row.original.id;

                if (isEditing) {
                    return (
                        <EditableMonthlyFeeCell
                            divisionMembershipType={row.original}
                            membershipTypeId={membershipTypeId}
                            onClose={() => setEditingId(null)}
                        />
                    );
                }

                return (
                    <button
                        type="button"
                        onClick={() => setEditingId(row.original.id)}
                        className="ml-auto flex items-center justify-end gap-2 rounded px-2 py-1 cursor-pointer hover:bg-gray-100"
                    >
                        <CurrencyCell
                            value={row.original.monthlyFee as number}
                        />
                        <Edit className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                    </button>
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
