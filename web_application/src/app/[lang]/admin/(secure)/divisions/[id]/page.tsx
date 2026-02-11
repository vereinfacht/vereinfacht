import { getDivision } from '@/actions/divisions/get';
import { ShowPageParams } from '@/types/params';
import { notFound } from 'next/navigation';
import EditButton from '../../components/EditButton';
import DetailField from '../../components/Fields/DetailField';
import Text from '@/app/components/Text/Text';
import createTranslation from 'next-translate/createTranslation';

interface Props {
    params: ShowPageParams;
}

export default async function DivisionShowPage({ params }: Props) {
    const division = await Promise.all([
        getDivision({ id: params.id, include: ['membershipTypes'] }),
    ]);

    if (!division) {
        notFound();
    }

    const { t } = createTranslation();

    const fields = [
        {
            attribute: 'titleTranslations',
            type: 'translation',
            label: 'division:title.label',
            value: division[0]?.titleTranslations,
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
            {division[0]?.membershipTypes ? (
                <>
                    <Text preset="headline" tag="h2" className="mt-6">
                        {t('membership_type:title.other')}
                    </Text>
                </>
            ) : null}
        </div>
    );
}
