'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import IconMenu from '/public/svg/menu.svg';
import { NavigationListItemType } from './List';
import IconClose from '/public/svg/close_new.svg';
import SidebarFooter from '@/app/components/SidebarFooter';
import List from './List';
import ProfileMenu from '../ProfileMenu';
import LanguageSelector from '@/app/components/LanguageSelector';
import useTranslation from 'next-translate/useTranslation';
import NavigationToggle from './NavigationToggle';
import TopBar from './TopBar';

interface Props {
    items: NavigationListItemType[];
    clubLogoUrl?: string;
    clubTitle?: string;
}

export default function MobileMenu({ items, clubLogoUrl, clubTitle }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { t } = useTranslation('admin');

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.classList.add('overflow-hidden');
            document.addEventListener('keydown', handleEscape);
        } else {
            document.body.classList.remove('overflow-hidden');
            document.removeEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    return (
        <div
            className={`group md:shadow-navigation z-10 flex w-full flex-col bg-white transition-colors duration-500 md:h-screen md:w-64 md:bg-white/50 ${isOpen ? 'is-open fixed h-full bg-linear-to-br from-[rgba(251,231,224,0.6)] via-[rgba(221,240,254,0.6)] to-[rgba(203,248,223,0.6)] shadow-none md:relative md:bg-none' : 'shadow-navigation sticky top-0'}`}
        >
            <TopBar
                clubLogoUrl={clubLogoUrl}
                clubTitle={clubTitle}
                rightContent={
                    <>
                        <LanguageSelector showLang={false} />
                        <ProfileMenu />
                        <NavigationToggle
                            icon={isOpen ? IconClose : IconMenu}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-expanded={isOpen}
                            aria-controls="main-navigation"
                            aria-label={
                                isOpen
                                    ? t('close_navigation')
                                    : t('open_navigation')
                            }
                        />
                    </>
                }
            />
            <div
                id="main-navigation"
                className="animate-move-down hidden h-full flex-col justify-between overflow-y-auto group-[.is-open]:flex md:flex md:animate-none md:overflow-auto [&::-webkit-scrollbar]:hidden"
            >
                <List items={items} />
                <SidebarFooter />
            </div>
        </div>
    );
}
