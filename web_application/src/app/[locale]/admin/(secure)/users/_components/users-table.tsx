'use client';
import { useTranslations } from 'next-intl';

import { DataTable } from '@/app/components/Table/DataTable';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TUserDeserialized } from '@/types/resources';
import { createDeleteFormAction } from '@/utils/deleteActions';
import { listUserSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import DateField from '../../components/Fields/Detail/DateField';
import BelongsToCell from '@/app/components/Table/BelongsToCell';
import TableToolbarActions from '../../components/TableToolbarActions';
import { TableName, TableBadge } from '@/app/components/ui/table-badge';

interface Props {
    users: TUserDeserialized[];
}

export default function UsersTable({ users }: Props) {
    const t = useTranslations();
    const deleteAction = createDeleteFormAction('users');

    const columns: ColumnDef<TUserDeserialized>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <HeaderSort
                    parser={listUserSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('user.title.label')}
                />
            ),
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <BelongsToCell
                        resource={user}
                        path="/admin/users"
                        content={user.name}
                        truncate
                    />
                );
            },
        },
        {
            accessorKey: 'email',
            meta: {
                mobileLabel: t('general.email'),
            } as any,
            header: t('general.email'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
        {
            accessorKey: 'role',
            header: t('role.title.other'),
            meta: {
                mobileLabel: t('role.title.other'),
            } as any,
            cell: ({ row }) => {
                const roles = row.original.roles as
                    { name: string }[] | undefined;

                if (!roles || roles.length === 0) {
                    return <TextCell>-</TextCell>;
                }

                return (
                    <div className="flex flex-wrap gap-2">
                        {roles.map((role) => (
                            <TableBadge
                                key={role.name}
                                table={TableName.Users}
                                status={role.name}
                                label={t(`role.${role.name}`)}
                            />
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: t('general.created_at'),
            meta: {
                mobileLabel: t('general.created_at'),
            } as any,
            cell: ({ row }) => <DateField value={row.getValue('createdAt')} />,
        },
        {
            accessorKey: 'updatedAt',
            header: t('general.updated_at'),
            meta: {
                mobileLabel: t('general.updated_at'),
            } as any,
            cell: ({ row }) => <DateField value={row.getValue('updatedAt')} />,
        },
    ];

    return (
        <>
            <TableToolbarActions createHref="/admin/users/create/" />
            <DataTable
                data={users}
                columns={columns}
                resourceName={'users' as ResourceName}
                canView={true}
                canEdit={true}
                deleteAction={deleteAction}
            />
        </>
    );
}
