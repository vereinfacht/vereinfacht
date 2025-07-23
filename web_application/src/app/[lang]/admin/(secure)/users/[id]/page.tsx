import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import { getUser } from '@/actions/users/get';
import DetailField from '../../components/Fields/DetailField';
import RolesTable from '../_components/roles-table';

interface Props {
    params: ShowPageParams;
}

export default async function UserShowPage({ params }: Props) {
    const user = await getUser({
        id: params.id,
        include: ['roles.permissions'],
    });

    if (!user) {
        notFound();
    }

    const { t } = createTranslation('user');
    const fields = [
        {
            label: 'ID',
            attribute: 'id',
        },
        {
            label: t('title.label'),
            attribute: 'name',
        },
        {
            label: t('email.label'),
            attribute: 'email',
        },
        {
            label: t('preferred_locale.label'),
            attribute: 'preferredLocale',
        },
        {
            label: t('created_at.label'),
            attribute: 'createdAt',
            type: 'date',
        },
        {
            label: t('updated_at.label'),
            attribute: 'updatedAt',
            type: 'date',
        },
    ];

    return (
        <div className="container flex flex-col gap-12">
            <EditButton href={`/admin/users/edit/${params.id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'users' as ResourceName}
                        value={user[field.attribute as keyof typeof user]}
                    />
                ))}
            </ul>
            <RolesTable roles={user.roles ?? []} />
        </div>
    );
}
