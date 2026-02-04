import { fetchClubDataOrFail } from '@/actions/fetchClubDataOrFail';
import MadeWith from '@/app/components/MadeWith';
import '@/globals.css';
import { ClubPageParams } from '@/types/params';
import { getDefaultMetadata } from '@/utils/metadata';
import { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import {
    defaultClubPrimaryColor,
    hexToCssString,
    shouldUseDarkMode,
} from '@/utils/colors';
import Footer from '@/app/components/Footer';

interface Props {
    children: ReactNode;
    params: ClubPageParams;
}

export async function generateMetadata({
    params,
}: {
    params: ClubPageParams;
}): Promise<Metadata> {
    const { slug, lang } = params;
    const club = await fetchClubDataOrFail(slug, lang);
    const metadata = getDefaultMetadata();
    return {
        ...metadata,
        title: `${club.title} - ${metadata.title}`,
    };
}

export async function generateViewport({
    params,
}: {
    params: ClubPageParams;
}): Promise<Viewport> {
    const { slug, lang } = params;
    const club = await fetchClubDataOrFail(slug, lang);

    return {
        themeColor: club.primaryColor ?? defaultClubPrimaryColor,
    };
}

export default async function ClubLayout({ children, params }: Props) {
    const { slug, lang } = params;
    const club = await fetchClubDataOrFail(slug, lang);
    const clubPrimaryColor = club.primaryColor ?? defaultClubPrimaryColor;

    return (
        <div
            // @ts-expect-error: custom properties are not typed
            style={{ '--color-primary-500': hexToCssString(clubPrimaryColor) }}
            className={[
                'flex min-h-screen flex-col',
                shouldUseDarkMode(clubPrimaryColor) ? 'dark-primary' : '',
            ].join(' ')}
        >
            {children}
            <Footer className="flex flex-col items-center justify-center">
                <div className="mb-4">
                    <MadeWith />
                </div>
            </Footer>
        </div>
    );
}
