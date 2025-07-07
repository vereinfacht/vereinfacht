'use client';

import { createContext, Dispatch, SetStateAction } from 'react';

export interface TabsContextType {
    selectedIndex: number;
    setSelectedIndex: Dispatch<SetStateAction<number>>;
    isFirstTab: boolean;
    isLastTab: boolean;
    goToNextTab: () => void;
    goToPreviousTab: () => void;
    goToTab: (index: number) => void;
}
export const TabsContext = createContext<TabsContextType | null>(null);
