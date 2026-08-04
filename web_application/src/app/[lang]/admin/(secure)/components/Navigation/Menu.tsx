'use client';

import SidebarFooter from '@/app/components/SidebarFooter';
import List, { NavigationListItemType } from './List';
import { useMenu } from './MenuProvider';

interface Props {
    items: NavigationListItemType[];
}

export default function Menu({ items }: Props) {
    const { isOpen } = useMenu();

    return (
        <div
            className={[
                'group z-10 flex flex-col bg-white transition-colors duration-500 md:relative md:w-64 md:bg-white/50',
                isOpen
                    ? 'is-open fixed inset-0 bg-linear-to-br from-[rgba(251,231,224,0.6)] via-[rgba(221,240,254,0.6)] to-[rgba(203,248,223,0.6)] pt-16 md:pt-0'
                    : 'hidden md:flex',
            ].join(' ')}
        >
            <div
                id="main-navigation"
                className="animate-move-down hidden flex-1 flex-col justify-between overflow-y-auto group-[.is-open]:flex md:flex md:animate-none md:overflow-auto [&::-webkit-scrollbar]:hidden"
            >
                <List items={items} />
                <SidebarFooter />
            </div>
        </div>
    );
}
