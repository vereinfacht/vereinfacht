'use client';
import { useLocale, useTranslations } from 'next-intl';

import { useState } from 'react';
import CurrencyCell from '@/app/components/Table/CurrencyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import { TDivisionMembershipTypeDeserialized } from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { ColumnDef } from '@tanstack/react-table';
import EditDivisionMembershipTypeModal from './edit-division-membership-type-modal';
import LinkCell from '@/app/components/Table/LinkCell';

interface Props {
    divisionMembershipTypes: TDivisionMembershipTypeDeserialized[];
    membershipTypeId: string;
}

export default function DivisionMembershipTypesTable({
    divisionMembershipTypes,
    membershipTypeId,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const deleteAction = createDeleteFormAction('division-membership-types');
    const [editingItem, setEditingItem] =
        useState<TDivisionMembershipTypeDeserialized | null>(null);

    const columns: ColumnDef<TDivisionMembershipTypeDeserialized>[] = [
        {
            id: 'division',
            header: t('division.title.label', { count: 1 }),
            cell: ({ row }) => (
                <LinkCell
                    href={`/admin/divisions/${row.original.division?.id}`}
                    title={row.original.division?.titleTranslations?.[locale]}
                />
            ),
        },
        {
            accessorKey: 'monthlyFee',
            meta: {
                mobileLabel: t('membership_type.monthly_fee.label'),
            } as any,
            header: () => (
                <div className="text-right">
                    {t('membership_type.monthly_fee.label')}
                </div>
            ),
            cell: ({ row }) => (
                <CurrencyCell value={row.original.monthlyFee as number} />
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={divisionMembershipTypes}
                columns={columns}
                resourceName={'divisionMembershipTypes'}
                totalPages={1}
                canEdit={true}
                onEdit={setEditingItem}
                canView={false}
                deleteAction={deleteAction}
            />
            {editingItem && (
                <EditDivisionMembershipTypeModal
                    divisionMembershipType={editingItem}
                    membershipTypeId={membershipTypeId}
                    lang={locale}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingItem(null);
                        }
                    }}
                />
            )}
        </>
    );
}
