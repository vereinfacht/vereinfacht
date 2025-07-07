'use client';

import { createContext, Dispatch } from 'react';
import { Application, ApplicationActions, Steps } from './ApplicationProvider';

export interface ApplicationContextType {
    application: Application;
    dispatch: Dispatch<ApplicationActions>;
    isStepSkipped: (step: Steps) => boolean;
    isStepCompleted: (step: Steps) => boolean;
}
export const ApplicationContext = createContext<ApplicationContextType | null>(
    null,
);
