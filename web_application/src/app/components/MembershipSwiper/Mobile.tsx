'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { SwiperOptions } from 'swiper';
import styles from './Mobile.module.css';
import { customInjectStyles } from './utils';

export default function Mobile({ children }: { children: ReactNode }) {
    const swiperElRef = useRef<HTMLElement>(null);
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
        swiperEl.addEventListener('init', handleInit);
        // @ts-expect-error: correct swiper ref type doesn't exist currently: https://github.com/nolimits4web/swiper/issues/5241 – UPDATE: this is probably solved by now, but we're unsure if we want to upgrade to newest swiper version or even continue using it altogether
        swiperEl.initialize();
        customInjectStyles(swiperEl);

        return () => {
            swiperEl.removeEventListener('afterInit', handleInit);
        };
    }, [swiperElRef]);

    return (
        <div
            className="w-full overflow-hidden px-8 pb-12 transition-opacity duration-300 ease-out"
            style={{ opacity }}
        >
            <swiper-container
                ref={swiperElRef}
                init={false}
                effect="cards"
                // @ts-expect-error: className and class-name won't work when
                // using the swiper as a web component and class give
                // the typical react className ts error
                class="max-w-[22rem]"
                wrapperClass={styles['swiper-wrapper']}
            >
                {children}
            </swiper-container>
        </div>
    );
}
