import { ApplicationProvider } from '@/hooks/application/ApplicationProvider';
import { TabsProvider } from '@/hooks/tabs/TabsProvider';
import ClubApplyTabbedForm from './components/ClubApplyTabbedForm';
import { fetchClubDataOrFail } from '@/actions/fetchClubDataOrFail';
import { ClubPageParams } from '@/types/params';
import ClubHeader from '@/app/components/ClubHeader';

interface ClubPageProps {
    params: ClubPageParams;
}

export default async function ClubPage({ params }: ClubPageProps) {
    const club = await fetchClubDataOrFail(params.slug, params.lang);

    return (
        <div className="flex-1 pb-10">
            <ApplicationProvider club={club}>
                <TabsProvider>
                    <ClubHeader club={club} />
                    <ClubApplyTabbedForm club={club} />
                </TabsProvider>
            </ApplicationProvider>
        </div>
    );
}
