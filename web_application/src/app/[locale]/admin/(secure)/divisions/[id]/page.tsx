import { getTranslations } from 'next-intl/server';
import { getDivision } from '@/actions/divisions/get';
import Text from '@/app/components/Text/Text';
import { ShowPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import DetailField from '../../components/Fields/DetailField';
import MembershipTypesTable from '../../membership-types/_components/membership-types-table';

interface Props {
    params: ShowPageParams;
}

export default async function DivisionShowPage({ params }: Props) {
    const { id } = await params;
    const division = await Promise.all([
        getDivision({ id: id, include: ['membershipTypes'] }),
    ]);

    if (!division) {
        notFound();
    }

    const t = await getTranslations();

    const fields = [
        {
            attribute: 'titleTranslations',
            type: 'translation',
            label: 'division.title.label',
            value: division[0]?.titleTranslations,
        },
    ];

    return (
        <div className="col-span-2 container flex flex-col gap-6">
            <EditButton href={`/admin/divisions/edit/${id}`} />
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
            {division[0]?.membershipTypes ? (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('membership_type.title.other')}
                    </Text>
                    <MembershipTypesTable
                        membershipTypes={division[0].membershipTypes || []}
                        extended={false}
                        totalPages={1}
                    />
                </>
            ) : null}
        </div>
    );
}
