import React from 'react';

import type { SwiperSlideProps, SwiperProps } from 'swiper/react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'swiper-container': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> &
                    Omit<SwiperProps, 'init'> & { init?: boolean | 'false' },
                HTMLElement
            >;
            'swiper-slide': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & SwiperSlideProps,
                HTMLElement
            >;
        }
    }
}
