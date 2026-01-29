'use client';

import React from 'react';
import './pagination.css';

interface Props {
    swiperIndex: number;
}

export default function Pagination({ swiperIndex }: Props) {
    const itemWidthInRem = 6; // when tweaking this value, remember to also change it in ./pagination.css
    const paginationOffsetInRem =
        (itemWidthInRem + 1) * -swiperIndex - itemWidthInRem / 2;

    return (
        <div className="pointer-events-none relative h-20 items-center overflow-hidden bg-linear-to-r from-white via-white/0 to-white">
            <div
                className="swiper-pagination absolute left-1/2 top-1/2 -z-10 flex items-center gap-4 transition-transform"
                style={{
                    transform: `translate(${paginationOffsetInRem}rem, -50%)`,
                }}
            ></div>
        </div>
    );
}
