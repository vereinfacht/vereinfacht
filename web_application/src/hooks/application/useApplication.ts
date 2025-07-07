'use client';

import { useContext } from 'react';
import { ApplicationContext } from './ApplicationContext';

export function useApplication() {
    const currentApplicationContext = useContext(ApplicationContext);

    if (!currentApplicationContext) {
        throw new Error(
            'useApplication has to be used within <ApplicationProvider>',
        );
    }

    return currentApplicationContext;
}
