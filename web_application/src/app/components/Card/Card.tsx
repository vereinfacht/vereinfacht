import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    className?: string;
    hoverAnimations?: boolean;
}

export default function Card({
    hoverAnimations = true,
    children,
    className,
}: Props) {
    return (
        <div
            className={[
                'overflow-hidden rounded-3xl bg-white shadow-card',
                hoverAnimations
                    ? 'transition-all duration-300 ease-out will-change-transform hover:translate-y-1 hover:shadow-card-hover'
                    : '',
                className,
            ].join(' ')}
        >
            {children}
        </div>
    );
}
