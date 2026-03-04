import { getDivision } from '@/actions/divisions/get';
import Text from '@/app/components/Text/Text';
import { ShowPageParams } from '@/types/params';
import { TMembershipTypeDeserialized } from '@/types/resources';
import createTranslation from 'next-translate/createTranslation';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import DetailField from '../../components/Fields/DetailField';
import MembershipTypesTable from '../../membership-types/_components/membership-types-table';

interface Props {
    params: ShowPageParams;
}

export default async function DivisionShowPage({ params }: Props) {
    const division = await getDivision({
        id: params.id,
        include: ['membershipTypes'],
    });

    if (!division) {
        notFound();
    }

    const { t } = createTranslation();

    const fields = [
        {
            attribute: 'titleTranslations',
            type: 'translation',
            label: 'division:title.label',
            value: division?.titleTranslations,
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <EditButton href={`/admin/divisions/edit/${params.id}`} />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    // @ts-expect-error: value type as element mismatch
                    <DetailField
                        key={index}
                        {...field}
                        resourceName={'divisions'}
                        value={field.value}
                    />
                ))}
            </ul>
            {division?.membershipTypes ? (
                <>
                    <div>
                        <Text preset="headline" tag="h2" className="mt-6">
                            {t('membership_type:title.other')}
                        </Text>
                        <AttachResourceModal
                            resourceType="membership-types"
                            parentResourceId={params.id}
                            parentResourceType="divisions"
                            alreadyAttachedIds={
                                division.membershipTypes?.map(
                                    (m: TMembershipTypeDeserialized) => m.id,
                                ) || []
                            }
                            lang={params.lang}
                        />
                    </div>
                    <MembershipTypesTable
                        membershipTypes={division.membershipTypes || []}
                        extended={false}
                        totalPages={1}
                    />
                </>
            ) : null}
        </div>
    );
}
