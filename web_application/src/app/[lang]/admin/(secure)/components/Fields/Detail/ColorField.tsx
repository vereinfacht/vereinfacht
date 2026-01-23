import Empty from '@/app/components/Empty';
import Text from '@/app/components/Text/Text';
import React from 'react';

interface Props {
    value?: number | string;
}

export default function ColorField({ value }: Props) {
    if (!value || value === '') {
        return <Empty text={'–'} />;
    }

    return (
        <div className="mb-2 flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-300"></div>
            <Text>{value}</Text>
        </div>
    );
}
