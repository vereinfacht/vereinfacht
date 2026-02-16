'use client';

import BelongsToManyCell from '@/app/components/Table/BelongsToManyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import {
    TDivisionDeserialized,
    TMembershipTypeDeserialized,
} from '@/types/resources';
import { listDivisionSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import CreateButton from '../../components/CreateButton';
import { createDeleteFormAction } from '@/utils/deleteActions';
import TableExportModal from '../../components/TableExportModal';

interface Props {
    divisions: TDivisionDeserialized[];
    allIds?: string[];
    totalPages: number;
    extended?: boolean;
}

export default function DivisionsTable({
    divisions,
    allIds,
    totalPages,
    extended = false,
}: Props) {
    const { t, lang } = useTranslation();
    const deleteAction = createDeleteFormAction('divisions');

    const columns: ColumnDef<TDivisionDeserialized>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) =>
                extended ? (
                    <HeaderSort
                        parser={listDivisionSearchParams.sort}
                        columnId={column.id}
                        columnTitle={t('division:title.label', { count: 1 })}
                    />
                ) : (
                    t('division:title.label', { count: 1 })
                ),
            cell: ({ row }) => {
                const title =
                    row.original.titleTranslations?.[lang] ||
                    row.getValue('title');
                return <TextCell>{title}</TextCell>;
            },
        },
        {
            accessorKey: 'membershipTypes',
            header: t('membership_type:title.other'),
            cell: (cell) => {
                const membershipTypes =
                    cell.getValue() as TMembershipTypeDeserialized[];

                return (
                    <BelongsToManyCell
                        truncate
                        items={membershipTypes}
                        basePath="/admin/membershipTypes"
                        parentPath={`/admin/divisions/${cell.row.original.id}`}
                        displayProperty="title"
                    />
                );
            },
        },
    ];

    return (
        <>
            {extended && (
                <div className="flex justify-between">
                    <CreateButton href="/admin/divisions/create" />
                    <TableExportModal
                        ids={allIds ?? []}
                        resourceName="divisions"
                    />
                </div>
            )}
            <DataTable
                data={divisions}
                columns={columns}
                resourceName={'divisions'}
                totalPages={totalPages}
                canEdit={true}
                canView={true}
                deleteAction={deleteAction}
            />
        </>
    );
}
