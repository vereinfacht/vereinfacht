'use client';

import { DataTable } from '@/app/components/Table/DataTable';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TMembershipTypeDeserialized } from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { listMembershipTypesSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import CreateButton from '../../components/CreateButton';
import TableExportModal from '../../components/TableExportModal';

interface Props {
    membershipTypes: TMembershipTypeDeserialized[];
    allIds?: string[];
    totalPages: number;
    extended?: boolean;
}

export default function MembershipTypesTable({
    membershipTypes,
    allIds,
    totalPages,
    extended = false,
}: Props) {
    const { t, lang } = useTranslation();
    const deleteAction = createDeleteFormAction('membership-types');

    const columns: ColumnDef<TMembershipTypeDeserialized>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) =>
                extended ? (
                    <HeaderSort
                        parser={listMembershipTypesSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('membership_type:title.label', {
                            count: 1,
                        })}
                    />
                ) : (
                    t('membership_type:title.label', { count: 1 })
                ),
            cell: ({ row }) => {
                const title =
                    row.original.titleTranslations?.[lang] ||
                    row.getValue('title');
                return <TextCell>{title}</TextCell>;
            },
        },
        {
            accessorKey: 'description',
            header: t('membership_type:description.label'),
            cell: ({ row }) => {
                const description =
                    row.original.descriptionTranslations?.[lang] ||
                    row.getValue('description');
                return <TextCell>{description}</TextCell>;
            },
        },
        {
            accessorKey: 'monthlyFee',
            header: t('membership_type:monthly_fee.label'),
            cell: ({ getValue }) => {
                const monthlyFee = getValue() as number;
                return (
                    <TextCell>
                        {monthlyFee.toLocaleString(lang, {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </TextCell>
                );
            },
        },
    ];

    return (
        <>
            {extended && (
                <div className="flex justify-between">
                    <CreateButton href="/admin/membership-types/create" />
                    <TableExportModal
                        ids={allIds ?? []}
                        resourceName="membership-types"
                    />
                </div>
            )}
            <DataTable
                data={membershipTypes}
                columns={columns}
                resourceName={'membership-types' as ResourceName}
                totalPages={totalPages}
                canEdit={true}
                canView={true}
                deleteAction={deleteAction}
            />
        </>
    );
}
