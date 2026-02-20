import React from 'react';
import useCurrency from '@/hooks/useCurrency';
import Text, { TextProps } from '../Text/Text';

interface Props extends TextProps {
    value: number;
    colorized?: boolean;
}

export default function CurrencyText({
    value,
    className,
    colorized = true,
    ...props
}: Props) {
    const { getFormatted } = useCurrency();

    return (
        <Text
            {...props}
            preset={'currency'}
            className={[
                className,
                value > 0 && colorized
                    ? 'text-green-500'
                    : value < 0 && colorized
                      ? 'text-red-400'
                      : 'text-slate-900',
            ].join(' ')}
        >
            {getFormatted(value)}
        </Text>
    );
}
