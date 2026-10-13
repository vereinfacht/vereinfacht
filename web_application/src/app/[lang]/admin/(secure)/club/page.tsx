import { getOne } from '@/actions/fetchAdminResources';
import { listActivityLogs } from '@/actions/activityLogs/list';
import { DetailFieldDef } from '@/resources/resource';
import { itemsPerPage } from '@/services/api-endpoints';
import { Club } from '@/types/models';
import { LocalizedPageParams, WithSearchParams } from '@/types/params';
import { TActivityLogDeserialized } from '@/types/resources';
import { auth } from '@/utils/auth';
import { loadListSearchParams } from '@/utils/search-params';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import createTranslation from 'next-translate/createTranslation';
import { redirect } from 'next/navigation';
import EditButton from '../components/EditButton';
import DetailField from '../components/Fields/DetailField';
import ActivityLogTable from './_components/activity-log-table';

interface Props extends WithSearchParams {
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

async function getClubActivityLogs(clubId: string, page: number) {
    const response = await listActivityLogs({
        sort: ['-createdAt'],
        page: { size: itemsPerPage, number: page },
        filter: {
            subjectType: 'clubs',
            subjectId: clubId,
        },
    });

    const activityLogs = deserialize(
        response as DocumentObject,
    ) as TActivityLogDeserialized[];
    const meta = (
        response as { meta?: { page?: { lastPage?: number } } }
    ).meta;
    const totalPages = meta?.page?.lastPage ?? 1;

    return { activityLogs, totalPages };
}

export default async function ClubPage({ params, searchParams }: Props) {
    const { lang } = await params;
    const club = await getClubData(lang);
    const { page } = await loadListSearchParams(searchParams);
    const { activityLogs, totalPages } = await getClubActivityLogs(
        club.id as string,
        page,
    );
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
            attribute: 'taxAccountChart',
            value: club['taxAccountChart']?.title ?? '-',
        },
        {
            attribute: 'taxAccountChartSource',
            type: 'html',
            formatValue: () => t('club:tax_account_chart_source.content'),
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
                        id={field.attribute}
                        value={field.value ?? club[field.attribute]}
                    />
                ))}
            </ul>
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">
                    {t('activity:title')}
                </h2>
                {activityLogs.length > 0 ? (
                    <ActivityLogTable
                        activityLogs={activityLogs}
                        totalPages={totalPages}
                        labelNamespace="club"
                    />
                ) : (
                    <p className="text-gray-500">{t('activity:empty')}</p>
                )}
            </section>
        </div>
    );
}
