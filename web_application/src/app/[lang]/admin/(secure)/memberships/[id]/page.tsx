import { getMembership } from '@/actions/memberships/get';
import EditButton from '../../components/EditButton';
import BelongsToField from '../../components/Fields/Detail/BelongsToField';
import DetailField from '../../components/Fields/DetailField';
import MembersTable from '../../members/_components/members-table';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import Text from '@/app/components/Text/Text';

interface Props {
    params: ShowPageParams;
}

export default async function MembershipShowPage({ params }: Props) {
    const membership = await getMembership({
        id: params.id,
        include: ['membershipType', 'owner', 'paymentPeriod', 'members'],
    });

    if (!membership) {
        notFound();
    }

    const { t } = createTranslation();
    console.log('Membership:', membership.membershipType.monthlyFee);
    const fields = [
        {
            attribute: 'status',
            label: t('membership:status.label'),
            value: membership.status
                ? t(`membership:status.${membership.status}`)
                : '',
        },
        {
            attribute: 'bankAccountHolder',
            label: t('membership:bank_account_holder.label'),
            value: membership.bankAccountHolder,
        },
        {
            attribute: 'bankIban',
            label: t('membership:bank_iban.label'),
            value: membership.bankIban,
        },
        {
            attribute: 'startedAt',
            label: t('membership:started_at.label'),
            type: 'date',
            value: membership.startedAt,
        },
        {
            attribute: 'endedAt',
            label: t('membership:ended_at.label'),
            type: 'date',
            value: membership.endedAt,
        },
        {
            attribute: 'notes',
            label: t('membership:notes.label'),
            value: membership.notes,
        },
        {
            attribute: 'monthlyFee',
            label: t('membership:monthly_fee.label'),
            type: 'currency',
            value: membership?.membershipType?.monthlyFee,
        },
        {
            attribute: 'paymentPeriod',
            label: t('payment_period:title.one'),
            value: membership.paymentPeriod?.title,
        },
        {
            attribute: 'membershipType',
            label: t('membership_type:title.one'),
            type: 'belongsTo' as const,
            fields: [
                {
                    attribute: 'title',
                    label: t('membership_type:title.label'),
                },
            ],
        },
        {
            attribute: 'owner',
            label: t('membership:owner.label'),
            type: 'belongsTo' as const,
            fields: [
                {
                    attribute: 'email',
                    label: t('general:email'),
                },
                {
                    attribute: 'firstName',
                    label: t('contact:first_name.label'),
                },
                {
                    attribute: 'lastName',
                    label: t('contact:last_name.label'),
                },
            ],
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <EditButton href={`/admin/memberships/edit/${params.id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => {
                    if (
                        'type' in field &&
                        field.type === 'belongsTo' &&
                        field.attribute === 'membershipType'
                    ) {
                        if (!membership.membershipType?.id) {
                            return null;
                        }

                        return (
                            // @ts-expect-error: reusing this component for a manually assembled related resource payload
                            <BelongsToField
                                key={index}
                                viewRoute={'/membership-types'}
                                {...field}
                                type="belongsTo"
                                value={{
                                    id: membership.membershipType.id,
                                    title: membership.membershipType.title,
                                }}
                            />
                        );
                    }

                    if (
                        'type' in field &&
                        field.type === 'belongsTo' &&
                        field.attribute === 'paymentPeriod'
                    ) {
                        if (!membership.paymentPeriod?.id) {
                            return null;
                        }

                        return (
                            // @ts-expect-error: reusing this component for a manually assembled related resource payload
                            <BelongsToField
                                key={index}
                                viewRoute={'/payment-periods'}
                                {...field}
                                type="belongsTo"
                                value={{
                                    id: membership.paymentPeriod.id,
                                    title: membership.paymentPeriod.title,
                                }}
                            />
                        );
                    }

                    if (
                        'type' in field &&
                        field.type === 'belongsTo' &&
                        field.attribute === 'owner'
                    ) {
                        if (!membership.owner?.id) {
                            return null;
                        }

                        return (
                            // @ts-expect-error: reusing this component for a manually assembled related resource payload
                            <BelongsToField
                                key={index}
                                viewRoute={'/members'}
                                {...field}
                                type="belongsTo"
                                value={{
                                    id: membership.owner.id,
                                    email: membership.owner.email,
                                    firstName: membership.owner.firstName,
                                    lastName: membership.owner.lastName,
                                }}
                            />
                        );
                    }

                    return (
                        <DetailField
                            key={index}
                            {...field}
                            resourceName={'memberships' as ResourceName}
                            value={field.value as any}
                        />
                    );
                })}
            </ul>

            {membership.members && (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('member:title.other')}
                    </Text>
                    <MembersTable
                        members={membership.members}
                        totalPages={1}
                        extended={false}
                    />
                </>
            )}
        </div>
    );
}
