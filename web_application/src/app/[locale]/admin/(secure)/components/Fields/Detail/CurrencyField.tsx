import Empty from '@/app/components/Empty';
import CurrencyText from '@/app/components/Text/CurrencyText';
import React from 'react';

interface Props {
    value?: number | string;
}

export default function CurrencyField({ value }: Props) {
    if (value == null || typeof value === 'string') {
        return <Empty text={'–'} />;
    }

    return <CurrencyText value={value} />;
}
