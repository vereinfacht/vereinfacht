import React from 'react';
import useCurrency from '@/hooks/useCurrency';
import Text, { TextProps } from '../Text/Text';

interface Props extends TextProps {
    value: number;
}

export default function CurrencyText({ value, className, ...props }: Props) {
    const { getFormatted } = useCurrency();

    return (
        <Text
            {...props}
            preset={'currency'}
            className={[
                className,
                'text-right',
                value > 0
                    ? 'text-green-500'
                    : value < 0
                      ? 'text-red-400'
                      : 'text-slate-900',
            ].join(' ')}
        >
            {getFormatted(value)}
        </Text>
    );
}
