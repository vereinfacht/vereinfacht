'use client';

import { MembershipSwiperContext } from '@/hooks/membershipSwiper/MembershipSwiperContext';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { Club } from '@/types/models';
import { useState } from 'react';
import { register } from 'swiper/element/bundle';
import MembershipCard from '../MembershipCard/MembershipCard';
import Desktop from './Desktop';
import Mobile from './Mobile';
import styles from './Mobile.module.css';

register();

interface MembershipSwiperProps {
    club: Club;
}

export default function MembershipSwiper({ club }: MembershipSwiperProps) {
    const { width = 0 } = useWindowDimensions();
    const isSmallScreen = width < 1000;
    const [showDivisions, setShowDivisions] = useState(false);
    const { primaryColor, membershipTypes, divisions } = club;
    const clubHasAnyAdmissionFee = membershipTypes.some(
        (membershipType) => membershipType.admissionFee,
    );
    const clubHasAnyMinimumMonthCount = membershipTypes.some(
        (membershipType) => membershipType.minimumNumberOfMonths > 0,
    );

    const slides = membershipTypes.map((membershipType, index) => (
        <swiper-slide
            key={index}
            // @ts-expect-error: className and class-name won't work when
            // using the swiper as a web component and class give
            // the typical react className ts error
            class={[
                'h-auto! rounded-3xl bg-white shadow-card',
                isSmallScreen
                    ? styles['swiper-slide']
                    : 'w-80! overflow-hidden shadow-card-sm',
            ].join(' ')}
        >
            <MembershipCard
                membershipType={membershipType}
                index={index}
                showMonthCount={clubHasAnyMinimumMonthCount}
                showAdmissionFee={clubHasAnyAdmissionFee}
            />
        </swiper-slide>
    ));

    return (
        <MembershipSwiperContext.Provider
            value={{
                divisions,
                showDivisions,
                setShowDivisions,
            }}
        >
            {isSmallScreen ? (
                <Mobile>{slides}</Mobile>
            ) : (
                <Desktop color={primaryColor}>{slides}</Desktop>
            )}
        </MembershipSwiperContext.Provider>
    );
}
