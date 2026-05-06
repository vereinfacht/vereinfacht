import { getMembership } from '@/actions/memberships/get';
import { listMembers } from '@/actions/members/list';
import EditButton from '../../components/EditButton';
import BelongsToField from '../../components/Fields/Detail/BelongsToField';
import DetailField from '../../components/Fields/DetailField';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import Text from '@/app/components/Text/Text';
import MembersTable from '../_components/members-table';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import {
    TDivisionMembershipTypeDeserialized,
    TMemberDeserialized,
} from '@/types/resources';

interface Props {
    params: ShowPageParams;
}

export default async function MembershipShowPage({ params }: Props) {
    const membership = await getMembership({
        id: params.id,
        include: [
            'membershipType',
            'membershipType.divisionMembershipTypes',
            'membershipType.divisionMembershipTypes.division',
            'owner',
            'paymentPeriod',
        ],
    });

    if (!membership) {
        notFound();
    }

    const membersResponse = await listMembers({
        page: {
            number: 1,
            size: 200,
        },
        filter: {
            membershipId: params.id,
        },
        include: ['divisions'],
    });

    const membersWithDivisions = deserialize(
        membersResponse as DocumentObject,
    ) as TMemberDeserialized[];

    const divisionMembershipTypes =
        (membership.membershipType
            ?.divisionMembershipTypes as TDivisionMembershipTypeDeserialized[]) ??
        [];

    const { t } = createTranslation();

    const fields = [
        {
            attribute: 'bankAccountHolder',
            label: t('membership:bank_account_holder.label'),
            value: membership.bankAccountHolder,
        },
        {
            attribute: 'status',
            label: t('membership:status.label'),
            value: membership.status
                ? t(`membership:status.${membership.status}`)
                : '',
        },
        {
            attribute: 'bankIban',
            label: t('membership:bank_iban.label'),
            value: membership.bankIban,
        },
        {
            attribute: 'monthlyFee',
            label: t('membership:monthly_fee.label'),
            type: 'currency',
            value: membership?.membershipType?.monthlyFee,
        },
        {
            attribute: 'voluntaryContribution',
            label: t('membership:voluntary_contribution.label'),
            type: 'currency',
            value: membership.voluntaryContribution,
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

            {membersWithDivisions.length > 0 && (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('member:title.other')}
                    </Text>
                    <MembersTable
                        members={membersWithDivisions}
                        divisionMembershipTypes={divisionMembershipTypes}
                        ownerId={
                            membership.owner?.id
                                ? [membership.owner.id]
                                : undefined
                        }
                        totalPages={1}
                    />
                </>
            )}
        </div>
    );
}
