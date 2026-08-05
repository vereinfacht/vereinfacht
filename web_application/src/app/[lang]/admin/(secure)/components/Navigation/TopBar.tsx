'use client';

import LanguageSelector from '@/app/components/LanguageSelector';
import IconMenu from '/public/svg/menu.svg';
import IconClose from '/public/svg/close_new.svg';
import useTranslation from 'next-translate/useTranslation';
import { useMenu } from './MenuProvider';
import ClubLogo from './ClubLogo';
import ProfileMenu from '../ProfileMenu';
import NavigationToggle from './NavigationToggle';

interface TopBarProps {
    clubLogoUrl?: string;
    clubTitle?: string;
    userName?: string;
}

export default function TopBar({
    clubLogoUrl,
    clubTitle,
    userName,
}: TopBarProps) {
    const { t } = useTranslation('admin');
    const { isOpen, toggleMenu } = useMenu();

    return (
        <header className="shadow-topbar backdrop-blur-topbar bg-bgSurfaceGlassStrong md:bg-bgSurfaceGlassSubtle relative z-20 flex w-full shrink-0 items-center justify-between">
            <div className="flex items-center px-4 py-3">
                <ClubLogo logoUrl={clubLogoUrl} title={clubTitle} />
            </div>

            <div className="flex items-center px-4">
                <LanguageSelector showLang={true} showArrow={true} />

                <ProfileMenu userName={userName} showArrow={true} />

                <div className="flex items-center md:hidden">
                    <NavigationToggle
                        icon={isOpen ? IconClose : IconMenu}
                        onClick={toggleMenu}
                        aria-expanded={isOpen}
                        aria-controls="main-navigation"
                        aria-label={
                            isOpen
                                ? t('close_navigation')
                                : t('open_navigation')
                        }
                    />
                </div>
            </div>
        </header>
    );
}
