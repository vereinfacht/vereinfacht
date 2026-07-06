'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import IconMenu from '/public/svg/menu.svg';
import { NavigationListItemType } from './List';
import IconClose from '/public/svg/close-new.svg';
import SidebarFooter from '@/app/components/SidebarFooter';
import List from './List';
import ClubLogo from './ClubLogo';
import ProfileMenu from '../ProfileMenu';
import LanguageSelector from '@/app/components/LanguageSelector';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    items: NavigationListItemType[];
    clubLogoUrl?: string;
    clubTitle?: string;
    children?: React.ReactNode;
}

export default function MobileMenu({
    items,
    clubLogoUrl,
    clubTitle,
    children,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const navButtonClass = 'cursor-pointer p-3';
    const iconClass = 'fill-current';
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation('admin');

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            closeButtonRef.current?.focus();
        } else {
            openButtonRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className={`group ${isOpen ? 'is-open' : ''}`}>
            <div className="flex w-full items-center justify-between border-b border-neutral-200 bg-white px-5 py-2 md:hidden">
                <div className="flex items-center gap-3">
                    <ClubLogo logoUrl={clubLogoUrl} title={clubTitle} />
                    {children}
                </div>

                <div className="flex items-center text-neutral-600">
                    <div className={navButtonClass}>
                        <LanguageSelector showLang={false} />
                    </div>
                    <div className={navButtonClass}>
                        <ProfileMenu />
                    </div>
                    <button
                        ref={openButtonRef}
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className={navButtonClass}
                        aria-expanded={isOpen}
                        aria-controls="main-navigation"
                        aria-label={t('open_navigation')}
                    >
                        <IconMenu className={iconClass} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div
                id="main-navigation"
                className="invisible fixed inset-0 z-50 flex flex-col bg-white bg-linear-to-br from-[rgba(251,231,224,0.6)] via-[rgba(221,240,254,0.6)] to-[rgba(203,248,223,0.6)] opacity-0 group-[.is-open]:visible group-[.is-open]:opacity-100 md:visible md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:justify-between md:bg-white md:bg-none md:opacity-100"
            >
                <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-2 md:py-4">
                    <ClubLogo logoUrl={clubLogoUrl} title={clubTitle} />

                    <div className="flex items-center text-neutral-600 md:hidden">
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className={navButtonClass}
                            aria-label={t('close_navigation')}
                        >
                            <IconClose
                                className={iconClass}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>

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
