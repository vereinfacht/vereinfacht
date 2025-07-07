import Empty from '@/app/components/Empty';
import React from 'react';

interface Props {
    value?: string;
}

export default function ImageField({ value }: Props) {
    if (!value || value === '') {
        return <Empty text={'–'} />;
    }

    return (
        <picture className="flex h-12 items-center">
            <img src={value} alt="Logo" height={48} width={48} />
        </picture>
    );
}
