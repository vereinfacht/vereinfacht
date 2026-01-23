'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { SwiperOptions } from 'swiper';
import 'swiper/css';
import { customInjectStyles } from './utils';

const SWIPE_INDICATORS = true;

function getCustomPaginationStyles(primaryColor: string) {
    return `
    :host(swiper-container) .swiper-pagination-bullet {
        background-color: #8C9DA6;
    }
    :host(swiper-container) .swiper-pagination-bullet.swiper-pagination-bullet-active {
        background-color: ${primaryColor};
    }
    `;
}

interface Props {
    children: ReactNode;
    color: string;
}

export default function Desktop({ children, color }: Props) {
    const swiperElRef = useRef<HTMLElement>(null);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        if (!swiperElRef.current) {
            return;
        }

        const swiperEl = swiperElRef.current;
        const params: SwiperOptions = {
            slidesPerView: 'auto',
            centerInsufficientSlides: true,
            spaceBetween: 32,
            touchRatio: 1.5,
            keyboard: true,
            grabCursor: true,
            pagination: {
                clickable: true,
            },
        };

        function handleInit() {
            setOpacity(1);
        }

        Object.assign(swiperEl, params);
        swiperEl.addEventListener('init', handleInit);
        // @ts-expect-error: correct swiper ref type doesn't exist currently: https://github.com/nolimits4web/swiper/issues/5241 – UPDATE: this is probably solved by now, but we're unsure if we want to upgrade to newest swiper version or even continue using it altogether
        swiperEl.initialize();

        customInjectStyles(swiperEl, getCustomPaginationStyles(color));

        return () => {
            swiperEl.removeEventListener('afterInit', handleInit);
        };
    }, [swiperElRef, color]);

    return (
        <div
            className="relative w-full pb-12 transition-opacity duration-300 ease-out"
            style={{ opacity }}
        >
            {SWIPE_INDICATORS &&
                [...Array(2)].map((_item, index) => (
                    <div
                        key={index}
                        className={[
                            'pointer-events-none absolute z-10 h-full w-[32px] from-white/0 to-white/60',
                            index === 1
                                ? 'right-0 bg-linear-to-r'
                                : 'left-0 bg-linear-to-l',
                        ].join(' ')}
                    />
                ))}
            <swiper-container
                ref={swiperElRef}
                init={false}
                // @ts-expect-error: className and class-name won't work when
                // using the swiper as a web component and class give
                // the typical react className ts error
                class="px-12 pb-12"
            >
                {children}
            </swiper-container>
        </div>
    );
}
