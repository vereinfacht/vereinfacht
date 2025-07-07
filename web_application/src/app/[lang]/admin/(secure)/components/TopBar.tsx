import LanguageSelector from '@/app/components/LanguageSelector';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import Title from './Navigation/Title';
import ProfileMenu from './ProfileMenu';

export default async function TopBar() {
    const session = await auth();

    if (!session) {
        return redirect('/login');
    }

    return (
        <div className="flex items-center justify-between p-4 md:h-20 md:px-6 md:py-0">
            <Title className="hidden flex-1 md:block" />
            <div className="flex w-full justify-between gap-x-6 md:w-auto">
                <LanguageSelector />
                <ProfileMenu userName={session?.user?.attributes.name} />
            </div>
        </div>
    );
}
