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
                'shadow-card overflow-hidden rounded-3xl bg-white',
                hoverAnimations
                    ? 'hover:shadow-card-hover transition-all duration-300 ease-out will-change-transform hover:translate-y-1'
                    : '',
                className,
            ].join(' ')}
        >
            {children}
        </div>
    );
}
