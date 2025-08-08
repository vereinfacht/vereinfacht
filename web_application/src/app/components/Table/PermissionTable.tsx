import Checkbox from '@/app/components/Input/Checkbox';
import { DataTable } from '@/app/components/Table/DataTable';
import Text from '@/app/components/Text/Text';
import { ResourceName } from '@/resources/resource';
import { TPermissionDeserialized } from '@/types/resources';
import { resourceNameToTranslateKey } from '@/utils/strings';
import { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

interface Props {
    allPermissions: TPermissionDeserialized[];
    activePermissions: TPermissionDeserialized[];
    isForm?: boolean;
}

type PermissionTable = {
    resource: string;
    [action: string]: string | boolean;
};

const ACTIONS: (keyof PermissionTable)[] = [
    'view',
    'create',
    'update',
    'delete',
] as const;

export default function PermissionTable({
    activePermissions,
    allPermissions,
    isForm = false,
}: Props) {
    const { t } = useTranslation();

    const tableData = () => {
        const activePermissionSet = new Set(
            activePermissions.map((permission) => permission.name),
        );

        const resourceMap = new Map<string, PermissionTable>();

        allPermissions.forEach((permission) => {
            const [action, ...resourceParts] = permission.name.split(' ');
            const resource = resourceParts.join(' ');

            if (!resourceMap.has(resource)) {
                resourceMap.set(resource, {
                    resource,
                    view: false,
                    create: false,
                    update: false,
                    delete: false,
                });
            }

            const permissionObj = resourceMap.get(resource)!;

            if (ACTIONS.includes(action as keyof PermissionTable)) {
                permissionObj[action as keyof PermissionTable] =
                    activePermissionSet.has(permission.name);
            }
        });

        return {
            permissions: Array.from(resourceMap.values()),
        };
    };

    const columns: ColumnDef<PermissionTable>[] = [
        {
            accessorKey: 'resource',
            header: t('resource:title.other'),
            cell: ({ row }) => {
                const resource = row.original.resource;
                const translated = t(
                    `${resourceNameToTranslateKey(resource)}:title.one`,
                );

                return (
                    <Text>
                        {translated ===
                        `${resourceNameToTranslateKey(resource)}:title.one`
                            ? t(`permission:resource.${resource}.title.one`)
                            : translated}
                    </Text>
                );
            },
        },
        ...ACTIONS.map((action) => ({
            accessorKey: action,
            header: t(`permission:action.${action}`),
            cell: ({ row }) =>
                isForm ? (
                    <Checkbox
                        id={`${row.index}-${action}`}
                        defaultValue={row.original[action] as boolean}
                        disabled
                    />
                ) : row.original[action] ? (
                    <Check color="green" />
                ) : (
                    <X color="red" />
                ),
        })),
    ];

    return (
        <DataTable
            data={tableData().permissions}
            columns={columns as any[]}
            resourceName={'permissions' as ResourceName}
        />
    );
}
