import React from 'react';
import { STATUS_DOT_PRESETS, StatusDotPreset } from './presets';

interface Props {
    status: StatusDotPreset;
    className?: string;
}

export default function StatusDot({
    status = 'default',
    className: classNameOverrides = '',
}: Props) {
    const className = STATUS_DOT_PRESETS[status];

    return (
        <div
            className={[
                'h-2 w-2 shrink-0 grow-0 justify-center rounded-full',
                className,
                classNameOverrides,
            ].join(' ')}
        ></div>
    );
}
