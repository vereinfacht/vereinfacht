'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import IconMenu from '/public/svg/menu.svg';
import { NavigationListItemType } from './List';
import IconClose from '/public/svg/close-new.svg';
import SidebarFooter from '@/app/components/SidebarFooter';
import IconAccount from '/public/svg/person_new.svg';
import IconGlobe from '/public/svg/globe.svg';
import List from './List';
import ClubLogo from './ClubLogo';

interface Props {
    items: NavigationListItemType[];
    clubLogoUrl?: string;
    clubTitle?: string;
}

export default function MobileMenu({ items, clubLogoUrl, clubTitle }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const navButtonClass = 'cursor-pointer p-3';
    const iconClass = 'fill-current';

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

    return (
        <div className="md:hidden">
            <div className="flex items-center gap-1 text-neutral-600">
                <button className={navButtonClass}>
                    <IconGlobe className={iconClass} />
                </button>

                <button className={navButtonClass}>
                    <IconAccount className={iconClass} />
                </button>

                <button
                    onClick={() => setIsOpen(true)}
                    className={navButtonClass}
                    aria-label="open menu"
                >
                    <IconMenu className={iconClass} />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white bg-linear-to-br from-[rgba(251,231,224,0.6)] via-[rgba(221,240,254,0.6)] to-[rgba(203,248,223,0.6)]">
                    <div className="flex items-center justify-between border-b border-neutral-300 px-5 py-2">
                        <div onClick={() => setIsOpen(false)}>
                            <ClubLogo logoUrl={clubLogoUrl} title={clubTitle} />
                        </div>

                        <div className="flex items-center text-neutral-600">
                            <button
                                onClick={() => setIsOpen(false)}
                                className={navButtonClass}
                                aria-label="close menu"
                            >
                                <IconClose className={iconClass} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <List items={items} />

                        <div>
                            <SidebarFooter />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
