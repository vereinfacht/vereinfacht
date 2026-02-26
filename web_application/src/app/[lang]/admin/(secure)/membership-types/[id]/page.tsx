import { getMembershipType } from '@/actions/membershipTypes/get';
import ResourceTable from '@/app/components/Table/ResourceTable';
import Text from '@/app/components/Text/Text';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import DetailField from '../../components/Fields/DetailField';
import DivisionsTable from '../../divisions/_components/divisions-table';

interface Props {
    params: ShowPageParams;
}

export default async function MembershipTypeShowPage({ params }: Props) {
    const membershipType = await Promise.all([
        getMembershipType({ id: params.id, include: ['divisions'] }),
    ]);

    if (!membershipType) {
        notFound();
    }

    const { t } = createTranslation();

    const fields = [
        {
            attribute: 'titleTranslations',
            type: 'translation',
            label: 'membership_type:title.label',
            value: membershipType[0]?.titleTranslations,
        },
        {
            attribute: 'descriptionTranslations',
            type: 'translation',
            label: 'membership_type:description.label',
            value: membershipType[0]?.descriptionTranslations,
        },
        {
            attribute: 'monthlyFee',
            type: 'currency',
            label: 'membership_type:monthly_fee.label',
            value: membershipType[0]?.monthlyFee,
        },
        {
            attribute: 'admissionFee',
            type: 'currency',
            label: 'membership_type:admission_fee.label',
            value: membershipType[0]?.admissionFee,
        },
        {
            attribute: 'minimum_number_of_members',
            type: 'number',
            label: 'membership_type:minimum_number_of_members.label',
            value: membershipType[0]?.minimumNumberOfMembers,
        },
        {
            attribute: 'maximum_number_of_members',
            type: 'number',
            label: 'membership_type:maximum_number_of_members.label',
            value: membershipType[0]?.maximumNumberOfMembers,
        },
        {
            attribute: 'minimum_number_of_months',
            type: 'number',
            label: 'membership_type:minimum_number_of_months.label',
            value: membershipType[0]?.minimumNumberOfMonths,
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <EditButton href={`/admin/membership-types/edit/${params.id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    // @ts-expect-error: value type as element mismatch

                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'membershipTypes'}
                        value={field.value}
                    />
                ))}
            </ul>
            {membershipType[0]?.divisions ? (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('division:title.other')}
                    </Text>
                    <DivisionsTable
                        divisions={membershipType[0].divisions || []}
                        extended={false}
                        totalPages={1}
                    />
                </>
            ) : null}
        </div>
    );
}
