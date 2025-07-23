'use client';

import { DataTable } from '@/app/components/Table/DataTable';
import Text from '@/app/components/Text/Text';
import { Badge } from '@/app/components/ui/badge';
import { ResourceName } from '@/resources/resource';
import { TRoleDeserialized } from '@/types/resources';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    roles: TRoleDeserialized[];
}

export default function RolesTable({ roles }: Props) {
    const { t } = useTranslation('user');

    const columns: ColumnDef<TRoleDeserialized>[] = [
        {
            accessorKey: 'role',
            header: t('role.label'),
            cell: ({ row }) => (
                <>
                    <Badge
                        variant={
                            row.original.name === 'super admin'
                                ? 'secondary'
                                : row.original.name === 'club admin'
                                  ? 'primary'
                                  : row.original.name === 'club treasurer'
                                    ? 'default'
                                    : 'default'
                        }
                    >
                        {t(`role.${row.original.name}`)}
                    </Badge>
                </>
            ),
        },
        {
            accessorKey: 'permissions',
            header: t('permissions.label'),
            cell: ({ row }) => {
                return row.original.permissions.map(
                    (permission: { name: string }, index: number) => (
                        <Text key={index}>{permission.name}</Text>
                    ),
                );
            },
        },
    ];

    return (
        <div>
            <Text className="mb-4">{t('role.other')}</Text>
            <DataTable
                data={roles as any}
                columns={columns as any}
                resourceName={'roles' as ResourceName}
            />
        </div>
    );
}
