'use client';

import { useContext } from 'react';
import { MembershipSwiperContext } from './MembershipSwiperContext';

export function useMembershipSwiper() {
    const currentMembershipSwiperContext = useContext(MembershipSwiperContext);

    if (!currentMembershipSwiperContext) {
        throw new Error(
            'useMembershipSwiper has to be used within <MembershipSwiperProvider>',
        );
    }

    return currentMembershipSwiperContext;
}
