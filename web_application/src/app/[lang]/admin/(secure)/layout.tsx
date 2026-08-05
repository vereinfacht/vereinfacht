import { getCurrentClub } from '@/actions/clubs/getCurrent';
import Navigation from '@/app/[lang]/admin/(secure)/components/Navigation/Navigation';
import {
    defaultClubPrimaryColor,
    hexToCssString,
    shouldUseDarkMode,
} from '@/utils/colors';
import { PropsWithChildren } from 'react';
import ContentContainer from './components/ContentContainer';
import TitleBar from './components/TitleBar';
import { auth } from '@/utils/auth';
import { MenuProvider } from './components/Navigation/MenuProvider';
import TopBar from './components/Navigation/TopBar';

export default async function SecureLayout({ children }: PropsWithChildren) {
    const club = await getCurrentClub();
    const session = await auth();
    const clubPrimaryColor = club?.primaryColor ?? defaultClubPrimaryColor;

    return (
        <MenuProvider>
            <div
                style={{
                    // @ts-expect-error: custom properties are not typed
                    ['--color-primary-500']: hexToCssString(clubPrimaryColor),
                }}
                className={[
                    'flex min-h-screen w-full flex-col bg-slate-400',
                    shouldUseDarkMode(clubPrimaryColor) ? 'dark-primary' : '',
                ].join(' ')}
            >
                <TopBar
                    clubLogoUrl={club?.logoUrl}
                    clubTitle={club?.title}
                    userName={session?.user?.attributes?.name}
                />

                <div className="flex w-full flex-1 flex-col overflow-hidden md:flex-row">
                    <Navigation />
                    <div className="flex w-full flex-1 flex-col overflow-y-auto bg-white">
                        <TitleBar />
                        <ContentContainer>{children}</ContentContainer>
                    </div>
                </div>
            </div>
        </MenuProvider>
    );
}
