import Empty from '@/app/components/Empty';
import Text from '@/app/components/Text/Text';
import React from 'react';

interface Props {
    value?: number | string;
}

export default function DefaultField({ value }: Props) {
    if (value === null || value === undefined || value === '') {
        return <Empty text={'–'} />;
    }

    return (
        <Text className="hyphens-auto whitespace-break-spaces">{value}</Text>
    );
}
