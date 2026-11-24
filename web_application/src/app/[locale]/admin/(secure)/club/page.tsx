import { getTranslations } from 'next-intl/server';
import { getOne } from '@/actions/fetchAdminResources';
import { DetailFieldDef } from '@/resources/resource';
import { Club } from '@/types/models';
import { LocalizedPageParams } from '@/types/params';
import { auth } from '@/utils/auth';
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
    const { locale } = await params;
    const club = await getClubData(locale);
    const t = await getTranslations();

    const fields: DetailFieldDef<Club>[] = [
        {
            attribute: 'title',
            label: t('club.title.label'),
        },
        {
            attribute: 'extendedTitle',
            label: t('club.extended_title.label'),
        },
        {
            attribute: 'applyTitle',
            label: t('club.apply_title.label'),
        },
        {
            attribute: 'applyUrl',
            label: t('club.apply_url.label'),
            type: 'link',
        },
        {
            attribute: 'address',
            label: t('club.address.label'),
            value: `${club['address']}\n${club['zipCode']} ${club['city']}\n${club['country']}`,
        },
        {
            attribute: 'email',
            label: t('club.email.label'),
        },
        {
            attribute: 'websiteUrl',
            label: t('club.website_url.label'),
            type: 'link',
        },
        {
            attribute: 'primaryColor',
            label: t('club.primary_color.label'),
            type: 'color',
        },
        {
            attribute: 'logoUrl',
            label: t('club.logo.label'),
            help: '',
            type: 'image',
        },
        {
            attribute: 'privacyStatementUrl',
            label: t('club.privacy_statement_url.label'),
            type: 'link',
        },
        {
            attribute: 'contributionStatementUrl',
            label: t('club.contribution_statement_url.label'),
            type: 'link',
        },
        {
            attribute: 'constitutionUrl',
            label: t('club.constitution_url.label'),
            type: 'link',
        },
        {
            attribute: 'taxAccountChart',
            label: t('club.tax_account_chart.label'),
            value: club['taxAccountChart']?.title ?? '-',
        },
        {
            attribute: 'taxAccountChartSource',
            label: t('club.tax_account_chart_source.label'),
            type: 'html',
            formatValue: () => t.raw('club.tax_account_chart_source.content'),
        },
        {
            attribute: 'membershipStartCycleType',
            label: t('club.membership_start_cycle_type.label'),
            formatValue: (value) =>
                t(`club.membership_start_cycle_type.${value}`),
        },
        {
            attribute: 'allowVoluntaryContribution',
            label: t('club.allow_voluntary_contribution.label'),
            type: 'boolean',
        },
        {
            attribute: 'hasConsentedMediaPublicationIsRequired',
            label: t('club.has_consented_media_publication_is_required.label'),
            type: 'boolean',
        },
        {
            attribute: 'hasConsentedMediaPublicationDefaultValue',
            label: t(
                'club.has_consented_media_publication_default_value.label',
            ),
            type: 'boolean',
        },
    ];

    return (
        <div className="col-span-2 container flex flex-col gap-6">
            <EditButton href="/admin/club/edit" />
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <DetailField<Club>
                        key={index}
                        {...field}
                        resourceName="clubs"
                        id={field.attribute}
                        value={field.value ?? club[field.attribute]}
                    />
                ))}
            </ul>
        </div>
    );
}
