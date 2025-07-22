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
    const { t } = useTranslation('user');

    const columns: ColumnDef<TUserDeserialized>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <TextCell>{row.getValue('id')}</TextCell>,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <HeaderSort
                    parser={listUserSearchParams.sort}
                    columnId={column.id}
                    columnTitle={t('title.label')}
                />
            ),
            cell: ({ row }) => <TextCell>{row.getValue('name')}</TextCell>,
        },
        {
            accessorKey: 'email',
            header: t('email.label'),
            cell: ({ row }) => <TextCell>{row.getValue('email')}</TextCell>,
        },
        {
            accessorKey: 'role',
            header: t('role.label'),
            cell: ({ row }) => {
                const roles = row.original.roles as
                    | { name: string }[]
                    | undefined;

                if (!roles || roles.length === 0) {
                    return <TextCell>-</TextCell>;
                }

                return (
                    <>
                        {roles.map((role: { name: string }, index: number) => (
                            <Badge key={index} variant="primary">
                                {role.name}
                            </Badge>
                        ))}
                    </>
                );
            },
        },
        {
            accessorKey: 'preferredLocale',
            header: t('preferred_locale.label'),
            cell: ({ row }) => (
                <TextCell>{row.getValue('preferredLocale')}</TextCell>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: t('created_at.label'),
            cell: ({ row }) => <DateField value={row.getValue('createdAt')} />,
        },
        {
            accessorKey: 'updatedAt',
            header: t('updated_at.label'),
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
