import React, { PropsWithChildren } from 'react';
import Text, { TextPresets } from '../Text/Text';

export interface TextCellProps extends PropsWithChildren {
    preset?: TextPresets;
    truncate?: boolean;
    className?: string;
}

export default function TextCell({
    children,
    preset = 'default',
    truncate = false,
    className = '',
}: TextCellProps) {
    return (
        <Text
            suppressHydrationWarning
            preset={preset}
            className={[
                'whitespace-nowrap',
                truncate
                    ? 'w-40 overflow-hidden text-ellipsis whitespace-nowrap'
                    : '',
                className,
            ].join(' ')}
        >
            {children}
        </Text>
    );
}
