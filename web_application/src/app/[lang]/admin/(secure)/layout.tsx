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

export default async function SecureLayout({ children }: PropsWithChildren) {
    const club = await getCurrentClub();

    const clubPrimaryColor = club?.primaryColor ?? defaultClubPrimaryColor;

    return (
        <div
            style={{
                // @ts-expect-error: custom properties are not typed
                ['--color-primary-500']: hexToCssString(clubPrimaryColor),
            }}
            className={[
                'flex min-h-screen w-full flex-col bg-slate-400 md:flex-row',
                shouldUseDarkMode(clubPrimaryColor) ? 'dark-primary' : '',
            ].join(' ')}
        >
            <Navigation />
            <div className="flex w-full flex-1 flex-col overflow-hidden bg-white">
                <TitleBar />
                <ContentContainer>{children}</ContentContainer>
            </div>
        </div>
    );
}
