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
        <>
            <div className="flex w-full items-center justify-between border-b border-neutral-200 bg-white px-5 py-2 md:hidden">
                <div className="flex items-center gap-3">
                    <ClubLogo logoUrl={clubLogoUrl} title={clubTitle} />
                    {children}
                </div>

                <div className="flex items-center text-neutral-600">
                    <button className={navButtonClass}>
                        <IconGlobe className={iconClass} />
                    </button>

                    <button className={navButtonClass}>
                        <IconAccount className={iconClass} />
                    </button>

                    <button
                        onClick={() => setIsOpen(true)}
                        className={navButtonClass}
                    >
                        <IconMenu className={iconClass} />
                    </button>
                </div>
            </div>

            <div
                className={` ${isOpen ? 'fixed inset-0 z-50 flex flex-col bg-white bg-linear-to-br from-[rgba(251,231,224,0.6)] via-[rgba(221,240,254,0.6)] to-[rgba(203,248,223,0.6)]' : 'hidden'} md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:justify-between md:bg-white md:bg-none`}
            >
                <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-2 md:py-4">
                    <div
                        onClick={() => setIsOpen(false)}
                        className="cursor-pointer md:cursor-default"
                    >
                        <ClubLogo logoUrl={clubLogoUrl} title={clubTitle} />
                    </div>

                    <div className="flex items-center text-neutral-600 md:hidden">
                        <button
                            onClick={() => setIsOpen(false)}
                            className={navButtonClass}
                        >
                            <IconClose className={iconClass} />
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
        </>
    );
}
