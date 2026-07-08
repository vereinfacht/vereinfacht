'use client';

import { useState, useEffect, useRef } from 'react';
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
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation('admin');

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        if (isOpen) {
            closeButtonRef.current?.focus();
        } else {
            openButtonRef.current?.focus();
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

    return (
        <div
            className={`group z-10 flex w-full flex-col bg-white shadow-xl transition-colors duration-500 md:h-screen md:w-64 ${isOpen ? 'is-open fixed bg-linear-to-br from-[rgba(251,231,224,0.6)] via-[rgba(221,240,254,0.6)] to-[rgba(203,248,223,0.6)] md:relative md:bg-none' : 'sticky top-0'}`}
        >
            <TopBar
                clubLogoUrl={clubLogoUrl}
                clubTitle={clubTitle}
                rightContent={
                    <>
                        <LanguageSelector showLang={false} />
                        <ProfileMenu />
                        <NavigationToggle
                            ref={openButtonRef}
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
                className="animate-move-down hidden h-full flex-col overflow-y-auto group-[.is-open]:flex md:flex md:animate-none md:justify-between md:overflow-auto"
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        setIsOpen(false);
                    }
                }}
            >
                <List items={items} />
                <SidebarFooter />
            </div>
        </div>
    );
}
