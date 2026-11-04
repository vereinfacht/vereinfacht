'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import type { SwiperContainer } from 'swiper/element';
import type { SwiperOptions } from 'swiper/types';
import styles from './Mobile.module.css';
import { customInjectStyles } from './utils';

export default function Mobile({ children }: { children: ReactNode }) {
    const swiperElRef = useRef<SwiperContainer>(null);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        if (!swiperElRef.current) {
            return;
        }

        const swiperEl = swiperElRef.current;

        const params: SwiperOptions = {
            grabCursor: true,
            cardsEffect: {
                rotate: false,
                perSlideOffset: 12,
                slideShadows: false,
            },
        };

        function handleInit() {
            setOpacity(1);
        }

        Object.assign(swiperEl, params);
        swiperEl.addEventListener('swiperinit', handleInit);
        swiperEl.initialize();
        customInjectStyles(swiperEl);

        return () => {
            swiperEl.removeEventListener('swiperinit', handleInit);
        };
    }, [swiperElRef]);

    return (
        <div
            className="w-full overflow-hidden px-8 pb-12 transition-opacity duration-300 ease-out"
            style={{ opacity }}
        >
            <swiper-container
                ref={swiperElRef}
                init="false"
                effect="cards"
                // @ts-expect-error: className and class-name won't work when
                // using the swiper as a web component and class give
                // the typical react className ts error
                class="mx-auto max-w-88"
                wrapperClass={styles['swiper-wrapper']}
            >
                {children}
            </swiper-container>
        </div>
    );
}
