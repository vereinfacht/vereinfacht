'use client';

import BelongsToManyCell from '@/app/components/Table/BelongsToManyCell';
import { DataTable } from '@/app/components/Table/DataTable';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TDivisionDeserialized, TMemberDeserialized } from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    members: TMemberDeserialized[];
    totalPages: number;
}

export default function MembersTable({ members, totalPages }: Props) {
    console.log(members);
    const { t } = useTranslation();
    const deleteAction = createDeleteFormAction('members');

    const columns: ColumnDef<TMemberDeserialized>[] = [
        {
            accessorKey: 'status',
            header: t('member:status.label'),
            cell: ({ row }) => (
                <TextCell>
                    {t(`member:status.${row.getValue('status')}`)}
                </TextCell>
            ),
        },
        {
            accessorKey: 'fullName',
            header: t('member:name.label'),
            cell: ({ row }) => <TextCell>{row.getValue('fullName')}</TextCell>,
        },
        {
            accessorKey: 'divisions',
            header: t('division:title.other'),
            cell: (cell) => {
                const divisions =
                    (cell.row.original.divisions as TDivisionDeserialized[]) ??
                    [];

                return (
                    <BelongsToManyCell
                        truncate
                        items={divisions}
                        basePath="/admin/divisions"
                        parentPath={`/admin/members/${cell.row.original.id}`}
                        displayProperty="title"
                    />
                );
            },
        },
        {
            accessorKey: 'email',
            header: t('member:email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
    ];

    return (
        <DataTable
            data={members}
            columns={columns}
            resourceName={'members' as ResourceName}
            totalPages={totalPages}
            canEdit={true}
            canView={true}
            canDelete={false}
            deleteAction={deleteAction}
        />
    );
}
