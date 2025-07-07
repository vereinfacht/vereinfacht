import useCurrency from '@/hooks/useCurrency';
import React, { HTMLAttributes } from 'react';
import Text from './Text/Text';

interface Props extends HTMLAttributes<HTMLParagraphElement> {
    price: number;
    withPrefix?: boolean;
}

function AdditionalCosts({ price, className, withPrefix = true }: Props) {
    const { getFormatted } = useCurrency();
    const formatted = (withPrefix ? '+ ' : '') + getFormatted(price ?? 0);

    return (
        <Text
            preset="display-light"
            tag="span"
            className={['ml-2 text-xs text-slate-700', className].join(' ')}
        >
            {formatted}
        </Text>
    );
}

export default AdditionalCosts;
