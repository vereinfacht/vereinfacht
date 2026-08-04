'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

interface MenuContextType {
    isOpen: boolean;
    toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType>({
    isOpen: false,
    toggleMenu: () => {},
});

export function MenuProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
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
        <MenuContext.Provider
            value={{ isOpen, toggleMenu: () => setIsOpen(!isOpen) }}
        >
            {children}
        </MenuContext.Provider>
    );
}

export const useMenu = () => useContext(MenuContext);
