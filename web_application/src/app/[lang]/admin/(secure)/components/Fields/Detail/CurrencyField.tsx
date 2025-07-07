import Empty from '@/app/components/Empty';
import Text from '@/app/components/Text/Text';
import useCurrency from '@/hooks/useCurrency';
import React from 'react';

interface Props {
    value?: number | string;
}

export default function CurrencyField({ value }: Props) {
    const { getFormatted } = useCurrency();

    if (value == null || typeof value === 'string') {
        return <Empty text={'–'} />;
    }

    return (
        <Text className="hyphens-auto whitespace-break-spaces">
            {getFormatted(value)}
        </Text>
    );
}
