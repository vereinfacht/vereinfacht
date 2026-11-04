import { getTranslations } from 'next-intl/server';
import { createDivisionMembershipTypeFormAction } from '@/actions/divisionMembershipTypes/create';
import { listDivisions } from '@/actions/divisions/list';
import { getMembershipType } from '@/actions/membershipTypes/get';
import TextInput from '@/app/components/Input/TextInput';
import Text from '@/app/components/Text/Text';
import { ResourceName } from '@/resources/resource';
import { ShowPageParams } from '@/types/params';
import { TDivisionMembershipTypeDeserialized } from '@/types/resources';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import DetailField from '../../components/Fields/DetailField';
import AttachResourceModal from '../../components/Relation/AttachResourceModal';
import DivisionMembershipTypesTable from '../_components/division-membership-types-table';

interface Props {
    params: ShowPageParams;
}

export default async function MembershipTypeShowPage({ params }: Props) {
    const { id, locale } = await params;
    const membershipType = await getMembershipType({
        id: id,
        include: ['divisionMembershipTypes.division'],
    });

    if (!membershipType) {
        notFound();
    }

    const t = await getTranslations();

    const fields = [
        {
            attribute: 'titleTranslations',
            type: 'translation',
            label: 'membership_type.title.label',
            value: membershipType?.titleTranslations,
        },
        {
            attribute: 'descriptionTranslations',
            type: 'translation',
            label: 'membership_type.description.label',
            value: membershipType?.descriptionTranslations,
        },
        {
            attribute: 'monthlyFee',
            type: 'currency',
            label: 'membership_type.monthly_fee.label',
            value: membershipType?.monthlyFee,
        },
        {
            attribute: 'admissionFee',
            type: 'currency',
            label: 'membership_type.admission_fee.label',
            value: membershipType?.admissionFee,
        },
        {
            attribute: 'minimum_number_of_members',
            type: 'number',
            label: 'membership_type.minimum_number_of_members.label',
            value: membershipType?.minimumNumberOfMembers,
        },
        {
            attribute: 'maximum_number_of_members',
            type: 'number',
            label: 'membership_type.maximum_number_of_members.label',
            value: membershipType?.maximumNumberOfMembers,
        },
        {
            attribute: 'minimum_number_of_divisions',
            type: 'number',
            label: 'membership_type.minimum_number_of_divisions.label',
            value: membershipType?.minimumNumberOfDivisions,
        },
        {
            attribute: 'maximum_number_of_divisions',
            type: 'number',
            label: 'membership_type.maximum_number_of_divisions.label',
            value: membershipType?.maximumNumberOfDivisions,
        },
        {
            attribute: 'minimum_number_of_months',
            type: 'number',
            label: 'membership_type.minimum_number_of_months.label',
            value: membershipType?.minimumNumberOfMonths,
        },
    ];

    return (
        <div className="col-span-2 container flex flex-col gap-6">
            <EditButton href={`/admin/membership-types/edit/${id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    // @ts-expect-error: type is not correctly inferred due to the value being optional in the resource type but required in the DetailField props
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'membershipTypes' as ResourceName}
                        value={field.value}
                    />
                ))}
            </ul>
            <div>
                <div className="mt-6 flex items-center justify-between">
                    <Text preset="headline" tag="h2">
                        {t('division.title.other')}
                    </Text>
                    <AttachResourceModal
                        title={t('membership_type.attach_division')}
                        triggerLabel={t('membership_type.attach_division')}
                        translationKey="division"
                        parentResourceId={id}
                        parentResourceType="membership-types"
                        parentRelationshipName="membershipType"
                        targetResourceType="divisions"
                        targetRelationshipName="division"
                        action={createDivisionMembershipTypeFormAction}
                        listAction={() => listDivisions()}
                        alreadyAttachedIds={
                            membershipType.divisionMembershipTypes?.map(
                                (
                                    divisionMembershipType: TDivisionMembershipTypeDeserialized,
                                ) => divisionMembershipType.division?.id || '',
                            ) || []
                        }
                        lang={locale}
                    >
                        <TextInput
                            id="monthlyFee"
                            name="monthlyFee"
                            type="number"
                            step="0.01"
                            label={t('membership_type.monthly_fee.label')}
                            required
                        />
                    </AttachResourceModal>
                </div>
                <DivisionMembershipTypesTable
                    divisionMembershipTypes={
                        membershipType.divisionMembershipTypes || []
                    }
                    membershipTypeId={id}
                />
            </div>
        </div>
    );
}
