import { getOne } from '@/actions/fetchAdminResources';
import { DetailFieldDef } from '@/resources/resource';
import { Club } from '@/types/models';
import { LocalizedPageParams } from '@/types/params';
import { auth } from '@/utils/auth';
import createTranslation from 'next-translate/createTranslation';
import { redirect } from 'next/navigation';
import EditButton from '../components/EditButton';
import DetailField from '../components/Fields/DetailField';

interface Props {
    params: LocalizedPageParams;
}

async function getClubData(locale: string) {
    const session = await auth();

    if (!session || !session.club_id) {
        return redirect('/login');
    }

    const [club] = await getOne<Club>(
        'clubs',
        session.club_id,
        { include: ['taxAccountChart'] },
        locale,
    );

    return club;
}

export default async function ClubPage({ params }: Props) {
    const { lang } = await params;
    const club = await getClubData(lang);
    const { t } = createTranslation();

    const fields: DetailFieldDef<Club>[] = [
        {
            attribute: 'title',
        },
        {
            attribute: 'extendedTitle',
        },
        {
            attribute: 'applyTitle',
        },
        {
            attribute: 'applyUrl',
            type: 'link',
        },
        {
            attribute: 'address',
            value: `${club['address']}\n${club['zipCode']} ${club['city']}\n${club['country']}`,
        },
        {
            attribute: 'email',
        },
        {
            attribute: 'websiteUrl',
            type: 'link',
        },
        {
            attribute: 'primaryColor',
            type: 'color',
        },
        {
            attribute: 'logoUrl',
            label: 'club:logo.label',
            help: '',
            type: 'image',
        },
        {
            attribute: 'privacyStatementUrl',
            type: 'link',
        },
        {
            attribute: 'contributionStatementUrl',
            type: 'link',
        },
        {
            attribute: 'constitutionUrl',
            type: 'link',
        },
        {
            attribute: 'taxAccountChart' as keyof Club,
            value: club['taxAccountChart']?.title ?? '-',
        },
        {
            attribute: 'membershipStartCycleType',
            formatValue: (value) =>
                t(`club:membership_start_cycle_type.${value}`),
        },
        {
            attribute: 'allowVoluntaryContribution',
            type: 'boolean',
        },
        {
            attribute: 'hasConsentedMediaPublicationIsRequired',
            type: 'boolean',
        },
        {
            attribute: 'hasConsentedMediaPublicationDefaultValue',
            type: 'boolean',
        },
    ];

    return (
        <div className="container flex flex-col gap-6">
            <EditButton href="/admin/club/edit" />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <DetailField<Club>
                        key={index}
                        {...field}
                        resourceName="clubs"
                        value={field.value ?? club[field.attribute]}
                    />
                ))}
            </ul>
        </div>
    );
}
