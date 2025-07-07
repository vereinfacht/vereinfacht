'use client';

import { useContext } from 'react';
import { TabsContext } from './TabsContext';

export function useTabs() {
    const currentTabsContext = useContext(TabsContext);

    if (!currentTabsContext) {
        throw new Error('useTabs has to be used within <TabsProvider>');
    }

    return currentTabsContext;
}
