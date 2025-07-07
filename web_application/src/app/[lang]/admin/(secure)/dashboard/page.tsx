import { getCurrentClub } from '@/actions/clubs/getCurrent';
import Loading from '@/app/loading';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import CardJoinSignalChat from '../components/CardJoinSignalChat';
import CardSupport from '../components/CardSupport';
import CardVisitApplyForm from '../components/CardVisitApplyForm';
import CardVisitClubWebsite from '../components/CardVisitClubWebsite';
import IconEmail from '/public/svg/email.svg';
import IconPhone from '/public/svg/phone.svg';

export default async function DashboardPage() {
    const session = await auth();

    if (!session || !session.club_id) {
        return redirect('/login');
    }

    const club = await getCurrentClub();

    if (!club) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid w-full auto-rows-[12rem] gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {club?.applyUrl != null && (
                    <CardVisitApplyForm url={club?.applyUrl} />
                )}
                {club?.websiteUrl != null && (
                    <CardVisitClubWebsite
                        url={club.websiteUrl}
                        logoUrl={club.logoUrl}
                    />
                )}
                {process.env.SIGNAL_INVITE_URL != null && (
                    <CardJoinSignalChat url={process.env.SIGNAL_INVITE_URL} />
                )}
                {process.env.SUPPORT_PHONE_NUMBER != null && (
                    <CardSupport
                        url={`tel:${process.env.SUPPORT_PHONE_NUMBER.replace(/\s/g, '')}`}
                        title={'support_phone'}
                        text={process.env.SUPPORT_PHONE_NUMBER}
                        icon={<IconPhone className="mb-2 h-8 fill-blue-500" />}
                    />
                )}
                {process.env.SUPPORT_EMAIL_ADDRESS != null && (
                    <CardSupport
                        url={`mailto:${process.env.SUPPORT_EMAIL_ADDRESS}`}
                        title={'support_email'}
                        text={process.env.SUPPORT_EMAIL_ADDRESS}
                        icon={<IconEmail className="mb-2 h-8 fill-blue-500" />}
                    />
                )}
            </div>
        </div>
    );
}
