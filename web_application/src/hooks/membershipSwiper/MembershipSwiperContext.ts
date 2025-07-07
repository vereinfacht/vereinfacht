'use client';

import { Division } from '@/types/models';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface MembershipSwiperContextType {
    divisions: Division[];
    showDivisions: boolean;
    setShowDivisions: Dispatch<SetStateAction<boolean>>;
}
export const MembershipSwiperContext =
    createContext<MembershipSwiperContextType | null>(null);
