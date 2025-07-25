'use client';

import Checkbox from '@/app/components/Input/Checkbox';
import { DataTable } from '@/app/components/Table/DataTable';
import Text from '@/app/components/Text/Text';
import { Badge } from '@/app/components/ui/badge';
import { ResourceName } from '@/resources/resource';
import { Model } from '@/types/models';
import { TPermissionDeserialized, TRoleDeserialized } from '@/types/resources';
import { ColumnDef } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    roles: TRoleDeserialized[];
    defaultPermissions?: TPermissionDeserialized[];
}

type RolePermissionRow = {
    role: string;
    resource: string;
    [action: string]: string | boolean;
};

export default function RolesTable({ roles, defaultPermissions }: Props) {
    const { t } = useTranslation('user');

    const ACTIONS: (keyof RolePermissionRow)[] = [
        'view',
        'create',
        'update',
        'delete',
    ];

    const resourceNames = Array.from(
        new Set(
            defaultPermissions?.map((permission) =>
                permission.name.split(' ').slice(1).join(' '),
            ) ?? [],
        ),
    );

    const tableData = roles.flatMap((role) => {
        const activePermissions = new Set(
            role.permissions.map(
                (permission: TPermissionDeserialized) => permission.name,
            ),
        );

        return resourceNames.map((resourceName, i) => ({
            role: role.name,
            showRole: i === 0,
            resource: resourceName,
            view: activePermissions.has(`view ${resourceName}`),
            update: activePermissions.has(`update ${resourceName}`),
            delete: activePermissions.has(`delete ${resourceName}`),
            create: activePermissions.has(`create ${resourceName}`),
        }));
    });

    const columns: ColumnDef<RolePermissionRow>[] = [
        {
            accessorKey: 'role',
            header: t('role.label'),
            cell: ({ row }) =>
                row.original.showRole ? (
                    <Badge
                        variant={
                            row.original.role === 'club admin'
                                ? 'secondary'
                                : 'default'
                        }
                    >
                        {t(`role.${row.original.role}`)}
                    </Badge>
                ) : null,
        },
        {
            accessorKey: 'resource',
            header: t('permissions.resource'),
        },
        ...ACTIONS.map(
            (action): ColumnDef<RolePermissionRow> => ({
                accessorKey: action,
                header: action as string,
                cell: ({ row }) => (
                    <Checkbox
                        id={`${row.original.role}-${action}-${row.original.resource}`}
                        defaultValue={
                            row.original[
                                action as keyof RolePermissionRow
                            ] as boolean
                        }
                        disabled={true}
                    />
                ),
            }),
        ),
    ];

    return (
        <div>
            <Text className="mb-4">{t('role.other')}</Text>
            <DataTable
                data={tableData as Model[]}
                columns={columns as ColumnDef<Model>[]}
                resourceName={roles[0] as ResourceName}
            />
        </div>
    );
}
