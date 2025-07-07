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
                'h-2 w-2 flex-shrink-0 flex-grow-0 justify-center rounded-full text-[100%]',
                className,
                classNameOverrides,
            ].join(' ')}
        ></div>
    );
}
