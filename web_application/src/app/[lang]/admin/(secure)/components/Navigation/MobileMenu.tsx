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
import ActionBar from './ActionBar';
import NavigationToggle from './NavigationToggle';

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
        <div className={`group ${isOpen ? 'is-open' : ''}`}>
            <ActionBar
                clubLogoUrl={clubLogoUrl}
                clubTitle={clubTitle}
                className="w-full bg-white md:hidden"
                rightContent={
                    <>
                        <div className="cursor-pointer p-3">
                            <LanguageSelector showLang={false} />
                        </div>
                        <div className="cursor-pointer p-3">
                            <ProfileMenu />
                        </div>
                        <NavigationToggle
                            ref={openButtonRef}
                            icon={IconMenu}
                            onClick={() => setIsOpen(true)}
                            aria-expanded={isOpen}
                            aria-controls="main-navigation"
                            aria-label={t('open_navigation')}
                        />
                    </>
                }
            />

            <div
                id="main-navigation"
                className="invisible fixed inset-0 z-50 flex flex-col bg-white bg-linear-to-br from-[rgba(251,231,224,0.6)] via-[rgba(221,240,254,0.6)] to-[rgba(203,248,223,0.6)] opacity-0 group-[.is-open]:visible group-[.is-open]:opacity-100 md:visible md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:justify-between md:bg-white md:bg-none md:opacity-100"
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        setIsOpen(false);
                    }
                }}
            >
                <ActionBar
                    clubLogoUrl={clubLogoUrl}
                    clubTitle={clubTitle}
                    className="md:py-4"
                    onLogoClick={() => setIsOpen(false)}
                    rightContent={
                        <div className="md:hidden">
                            <NavigationToggle
                                ref={closeButtonRef}
                                icon={IconClose}
                                onClick={() => setIsOpen(false)}
                                aria-label={t('close_navigation')}
                            />
                        </div>
                    }
                />

                <div className="flex flex-1 flex-col overflow-y-auto md:overflow-hidden">
                    <div className="flex-1 md:overflow-y-auto">
                        <List items={items} />
                    </div>

                    <div className="pb-0">
                        <SidebarFooter />
                    </div>
                </div>
            </div>
        </div>
    );
}
