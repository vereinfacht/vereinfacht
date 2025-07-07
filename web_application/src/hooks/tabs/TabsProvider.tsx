'use client';

import { useState } from 'react';
import { TabsContext } from './TabsContext';

interface TabsProviderProps {
    children: React.ReactNode;
}
export function TabsProvider({ children }: TabsProviderProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const isFirstTab = Boolean(selectedIndex === 0);
    const isLastTab = Boolean(selectedIndex === 4);

    const goToNextTab = () => {
        setSelectedIndex((previousIndex) => previousIndex + 1);
    };

    const goToPreviousTab = () => {
        setSelectedIndex((previousIndex) => previousIndex - 1);
    };

    const goToTab = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <TabsContext.Provider
            value={{
                selectedIndex,
                setSelectedIndex,
                isFirstTab,
                isLastTab,
                goToNextTab,
                goToPreviousTab,
                goToTab,
            }}
        >
            {children}
        </TabsContext.Provider>
    );
}
