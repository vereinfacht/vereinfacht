'use client';

import { DataTable } from '@/app/components/Table/DataTable';
import HeaderSort from '@/app/components/Table/HeaderSort';
import TextCell from '@/app/components/Table/TextCell';
import { ResourceName } from '@/resources/resource';
import { TUserDeserialized } from '@/types/resources';
import { listUserSearchParams } from '@/utils/search-params';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';
import DateField from '../../components/Fields/Detail/DateField';
import { Badge } from '@/app/components/ui/badge';

interface Props {
    users: TUserDeserialized[];
}

export default function UserTable({ users }: Props) {
    const { t } = useTranslation();

    const columns: ColumnDef<TUserDeserialized>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <HeaderSort
                    parser={listUserSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('user:title.label')}
                />
            ),
            cell: ({ row }) => <TextCell>{row.getValue('name')}</TextCell>,
        },
        {
            accessorKey: 'email',
            header: t('user:email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
        {
            accessorKey: 'role',
            header: t('role:title.other'),
            cell: ({ row }) => {
                const roles = row.original.roles as
                    | { name: string }[]
                    | undefined;

                if (!roles || roles.length === 0) {
                    return <TextCell>-</TextCell>;
                }

                return (
                    <div className="flex flex-wrap gap-2">
                        {roles.map((role: { name: string }) => (
                            <Badge
                                key={role.name}
                                variant={
                                    role.name === 'club admin'
                                        ? 'secondary'
                                        : 'default'
                                }
                            >
                                {t(`role:${role.name}`)}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: t('user:created_at.label'),
            cell: ({ row }) => <DateField value={row.getValue('createdAt')} />,
        },
        {
            accessorKey: 'updatedAt',
            header: t('user:updated_at.label'),
            cell: ({ row }) => <DateField value={row.getValue('updatedAt')} />,
        },
    ];

    return (
        <DataTable
            data={users}
            columns={columns}
            resourceName={'users' as ResourceName}
            canView={true}
            canEdit={true}
        />
    );
}
