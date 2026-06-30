'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import IconMenu from '/public/svg/menu.svg';
import { NavigationListItemType } from './List';
import IconClose from '/public/svg/x_close.svg';
import SidebarFooter from '@/app/components/SidebarFooter';
import IconAccount from '/public/svg/account.svg';
import IconGlobe from '/public/svg/globe_language.svg';
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
            <div className="flex items-center gap-1 text-zinc-600">
                <button className="p-3 transition-colors hover:text-slate-900">
                    <IconGlobe />
                </button>

                <button className="p-3 transition-colors hover:text-slate-900">
                    <IconAccount />
                </button>

                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 transition-colors hover:text-slate-900"
                    aria-label="open menu"
                >
                    <IconMenu />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-slate-50">
                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-2">
                        <div onClick={() => setIsOpen(false)}>
                            <ClubLogo logoUrl={clubLogoUrl} title={clubTitle} />
                        </div>

                        <div className="flex items-center text-zinc-600">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 transition-colors hover:text-slate-900"
                                aria-label="close menu"
                            >
                                <IconClose />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <List items={items} />
                    </div>

                    <SidebarFooter />
                </div>
            )}
        </div>
    );
}
