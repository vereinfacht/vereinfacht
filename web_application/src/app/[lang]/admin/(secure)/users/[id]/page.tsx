import { listPermissions } from '@/actions/permissions/list';
import { getUser } from '@/actions/users/get';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import { TPermissionDeserialized } from '@/types/resources';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import DetailField from '../../components/Fields/DetailField';
import RolesTable from '../_components/roles-table';

interface Props {
    params: ShowPageParams;
}

export default async function UserShowPage({ params }: Props) {
    const [user, permissionResponse] = await Promise.all([
        getUser({
            id: params.id,
            include: ['roles.permissions'],
        }),
        listPermissions({
            sort: ['name'],
        }),
    ]);

    if (!user) {
        notFound();
    }

    const permissions = deserialize(
        permissionResponse as DocumentObject,
    ) as TPermissionDeserialized[];
    const { t } = createTranslation();
    const fields = [
        {
            label: t('user:title.label'),
            attribute: 'name',
        },
        {
            label: t('general:email'),
            attribute: 'email',
        },
        {
            label: t('user:preferred_locale.label'),
            attribute: 'preferredLocale',
        },
        {
            label: t('general:created_at'),
            attribute: 'createdAt',
            type: 'date',
        },
        {
            label: t('general:updated_at'),
            attribute: 'updatedAt',
            type: 'date',
        },
    ];

    return (
        <div className="container flex flex-col gap-12">
            <EditButton href={`/admin/users/edit/${params.id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    // @ts-expect-error: value type as element mismatch
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'users' as ResourceName}
                        value={user[field.attribute as keyof typeof user]}
                    />
                ))}
            </ul>
            <RolesTable
                roles={user.roles ?? []}
                defaultPermissions={permissions ?? []}
            />
        </div>
    );
}
