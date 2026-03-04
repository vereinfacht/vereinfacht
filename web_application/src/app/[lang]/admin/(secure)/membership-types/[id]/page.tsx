import { getMembershipType } from '@/actions/membershipTypes/get';
import Text from '@/app/components/Text/Text';
import { ShowPageParams } from '@/types/params';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import DetailField from '../../components/Fields/DetailField';
import DivisionsTable from '../../divisions/_components/divisions-table';
import AttachResourceModal from '../../components/Relation/AttachResourceModal';
import { TDivisionDeserialized } from '@/types/resources';

interface Props {
    params: ShowPageParams;
}

export default async function MembershipTypeShowPage({ params }: Props) {
    const membershipTypeBody = await getMembershipType({
        id: params.id,
        include: ['divisions'],
    });

    if (!membershipTypeBody) {
        notFound();
    }

    const membershipType = membershipTypeBody;

    const { t } = createTranslation();

    const fields = [
        {
            attribute: 'titleTranslations',
            type: 'translation',
            label: 'membership_type:title.label',
            value: membershipType?.titleTranslations,
        },
        {
            attribute: 'descriptionTranslations',
            type: 'translation',
            label: 'membership_type:description.label',
            value: membershipType?.descriptionTranslations,
        },
        {
            attribute: 'monthlyFee',
            type: 'currency',
            label: 'membership_type:monthly_fee.label',
            value: membershipType?.monthlyFee,
        },
        {
            attribute: 'admissionFee',
            type: 'currency',
            label: 'membership_type:admission_fee.label',
            value: membershipType?.admissionFee,
        },
        {
            attribute: 'minimum_number_of_members',
            type: 'number',
            label: 'membership_type:minimum_number_of_members.label',
            value: membershipType?.minimumNumberOfMembers,
        },
        {
            attribute: 'maximum_number_of_members',
            type: 'number',
            label: 'membership_type:maximum_number_of_members.label',
            value: membershipType?.maximumNumberOfMembers,
        },
        {
            attribute: 'minimum_number_of_months',
            type: 'number',
            label: 'membership_type:minimum_number_of_months.label',
            value: membershipType?.minimumNumberOfMonths,
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
            {membershipType?.divisions ? (
                <>
                    <div className="mt-6 flex items-center justify-between">
                        <Text preset="headline" tag="h2">
                            {t('division:title.other')}
                        </Text>
                        <AttachResourceModal
                            parentResourceId={params.id}
                            parentResourceType="membership-types"
                            alreadyAttachedIds={
                                membershipType.divisions?.map(
                                    (d: TDivisionDeserialized) => d.id,
                                ) || []
                            }
                            lang={params.lang}
                        />
                    </div>
                    <DivisionsTable
                        divisions={membershipType.divisions || []}
                        extended={false}
                        totalPages={1}
                    />
                </>
            ) : null}
        </div>
    );
}
