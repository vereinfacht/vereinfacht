import { getMember } from '@/actions/members/get';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import BelongsToField from '../../components/Fields/Detail/BelongsToField';
import BelongsToManyField from '../../components/Fields/Detail/BelongsToManyField';
import DetailField from '../../components/Fields/DetailField';

interface Props {
    params: ShowPageParams;
}

export default async function MemberShowPage({ params }: Props) {
    const member = await getMember({
        id: params.id,
        include: ['divisions', 'membership', 'membership.owner', 'media'],
    });

    if (!member) {
        notFound();
    }

    const ownerId =
        (member?.membership?.owner as { id?: string } | undefined)?.id ?? null;
    const ownerFullName =
        ownerId === member.id
            ? (member.fullName ?? '')
            : ((member?.membership?.owner as { fullName?: string } | undefined)
                  ?.fullName ?? '');

    const { t } = createTranslation();
    const fields = [
        {
            attribute: 'status',
            label: t('member:status.label'),
            value: member.status,
        },
        {
            attribute: 'name',
            label: t('member:name.label'),
            value: member.fullName,
        },
        {
            attribute: 'gender',
            label: t('general:gender.label'),
            value: member.gender
                ? t('general:gender.options.' + member.gender)
                : '',
        },
        {
            attribute: 'birthday',
            label: t('member:birthday.label'),
            type: 'date',
            value: member?.birthday,
        },
        {
            attribute: 'email',
            label: t('general:email'),
            value: member?.email,
        },
        {
            label: t('member:phone_number.label'),
            attribute: 'phoneNumber',
            value: member?.phoneNumber,
        },
        {
            label: t('member:address.label'),
            attribute: 'address',
            value: member?.address,
        },
        {
            label: t('member:zip_code.label'),
            attribute: 'zipCode',
            value: member?.zipCode,
        },
        {
            label: t('member:city.label'),
            attribute: 'city',
            value: member?.city,
        },
        {
            label: t('member:country.label'),
            attribute: 'country',
            value: member?.country,
        },
        {
            attribute: 'media',
            type: 'media',
            value: member?.media,
            help: '',
        },
        {
            attribute: 'membership',
            label: t('membership:title.one'),
            type: 'belongsTo' as const,
            fields: [
                {
                    attribute: 'owner',
                    label: t('membership:owner.label'),
                    value: ownerFullName,
                },
            ],
        },
        {
            attribute: 'divisions',
            label: t('division:title.other'),
            type: 'belongsToMany' as const,
            basePath: '/admin/divisions',
            displayProperty: 'title',
            value: member.divisions ?? [],
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <EditButton href={`/admin/members/edit/${params.id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => {
                    if ('type' in field && field.type === 'belongsToMany') {
                        return (
                            <BelongsToManyField
                                key={index}
                                type="belongsToMany"
                                attribute={field.attribute}
                                label={field.label}
                                basePath={
                                    'basePath' in field
                                        ? field.basePath
                                        : undefined
                                }
                                displayProperty={
                                    'displayProperty' in field
                                        ? field.displayProperty
                                        : 'title'
                                }
                                value={
                                    'value' in field &&
                                    Array.isArray(field.value)
                                        ? field.value
                                        : []
                                }
                            />
                        );
                    }

                    if (
                        'type' in field &&
                        field.type === 'belongsTo' &&
                        field.attribute === 'membership'
                    ) {
                        if (!member.membership?.id) {
                            return null;
                        }

                        return (
                            // @ts-expect-error: reusing this component for a manually assembled related resource payload
                            <BelongsToField
                                key={index}
                                viewRoute={'/memberships'}
                                {...field}
                                type="belongsTo"
                                value={{
                                    id: member.membership.id,
                                    bankAccountHolder:
                                        member.membership.bankAccountHolder,
                                    startedAt: member.membership.startedAt,
                                    status: member.membership.status,
                                }}
                            />
                        );
                    }

                    return (
                        <DetailField
                            key={index}
                            {...field}
                            resourceName={'members' as ResourceName}
                            value={field.value as any}
                        />
                    );
                })}
            </ul>
        </div>
    );
}
