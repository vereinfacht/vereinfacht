'use client';

import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    index: number;
    hasMiddleSection: boolean;
}

export default function Section({ children, index, hasMiddleSection }: Props) {
    return (
        <li
            className={[
                '-mb-6 bg-slate-400 pb-12 pt-4',
                index > 0 && 'shadow-negative-sm',
                hasMiddleSection
                    ? 'animate-move-up rounded-3xl'
                    : 'rounded-t-3xl',
            ].join(' ')}
        >
            {children}
        </li>
    );
}
