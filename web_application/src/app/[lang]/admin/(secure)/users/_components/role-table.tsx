'use client';

import { DataTable } from '@/app/components/Table/DataTable';
import PermissionTable from '@/app/components/Table/PermissionTable';
import Text from '@/app/components/Text/Text';
import { Badge } from '@/app/components/ui/badge';
import { ResourceName } from '@/resources/resource';
import { TPermissionDeserialized, TRoleDeserialized } from '@/types/resources';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    roles: TRoleDeserialized[];
    defaultPermissions?: TPermissionDeserialized[];
}

export default function RolesTable({ roles, defaultPermissions }: Props) {
    const { t } = useTranslation();

    const columns: ColumnDef<TRoleDeserialized>[] = [
        {
            accessorKey: 'role',
            header: t('role:title.label'),
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.name === 'club admin'
                            ? 'secondary'
                            : 'default'
                    }
                >
                    {t(`role:${row.original.name}`)}
                </Badge>
            ),
        },
        {
            accessorKey: 'permissions',
            header: t('permission:title.other'),
            cell: ({ row }) => (
                <PermissionTable
                    allPermissions={defaultPermissions ?? []}
                    activePermissions={
                        row.original.permissions as TPermissionDeserialized[]
                    }
                />
            ),
        },
    ];

    return (
        <div>
            <Text className="mb-4">{t('role:title.other')}</Text>
            <DataTable
                data={roles}
                columns={columns}
                resourceName={'roles' as ResourceName}
            />
        </div>
    );
}
