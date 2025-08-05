import Checkbox from '@/app/components/Input/Checkbox';
import { DataTable } from '@/app/components/Table/DataTable';
import Text from '@/app/components/Text/Text';
import { ResourceName } from '@/resources/resource';
import { TPermissionDeserialized } from '@/types/resources';
import { camelCaseToSnakeCase } from '@/utils/strings';
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
];

export default async function PermissionTable({
    activePermissions,
    allPermissions,
    isForm = false,
}: Props) {
    const { t } = useTranslation();

    const resourceNames = Array.from(
        new Set(
            allPermissions.map((permission) =>
                permission.name.split(' ').slice(1).join(' '),
            ) ?? [],
        ),
    );
    const tableData = () => {
        const activePermissionSet = new Set(
            activePermissions?.map(
                (permission: TPermissionDeserialized) => permission.name,
            ),
        );
        const permissions: PermissionTable[] = resourceNames.map(
            (resourceName) => ({
                resource: resourceName,
                view: activePermissionSet.has(`view ${resourceName}`),
                create: activePermissionSet.has(`create ${resourceName}`),
                update: activePermissionSet.has(`update ${resourceName}`),
                delete: activePermissionSet.has(`delete ${resourceName}`),
            }),
        );

        return {
            permissions,
        };
    };

    const columns: ColumnDef<PermissionTable>[] = [
        {
            accessorKey: 'resource',
            header: t('resource:title.other'),
            cell: ({ row }) => {
                const singularResource = row.original.resource.replace(
                    /s$/,
                    '',
                );
                const resourceKey = camelCaseToSnakeCase(singularResource);
                return <Text>{t(`${resourceKey}:title.one`)}</Text>;
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
