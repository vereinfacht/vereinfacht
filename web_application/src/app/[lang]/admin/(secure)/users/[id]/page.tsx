import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import { getUser } from '@/actions/users/get';
import DetailField from '../../components/Fields/DetailField';

interface Props {
    params: ShowPageParams;
}

export default async function UserShowPage({ params }: Props) {
    const user = await getUser({ id: params.id });

    if (!user) {
        notFound();
    }

    const { t } = createTranslation('user');
    const fields = [
        {
            label: 'ID',
            attribute: 'id',
            value: user.id,
        },
        {
            label: t('title.label'),
            attribute: 'name',
            value: user.name,
        },
        {
            label: t('email.label'),
            attribute: 'email',
            value: user.email,
        },
        {
            label: t('role.label'),
            attribute: 'role',
            value: user.role,
        },
        {
            label: t('preferred_locale.label'),
            attribute: 'preferredLocale',
            value: user.preferredLocale,
        },
        {
            label: t('created_at.label'),
            attribute: 'createdAt',
            value: user.createdAt,
        },
        {
            label: t('updated_at.label'),
            attribute: 'updatedAt',
            value: user.updatedAt,
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
                        resourceName={'receipts' as ResourceName}
                        value={field.value}
                    />
                ))}
            </ul>
        </div>
    );
}
