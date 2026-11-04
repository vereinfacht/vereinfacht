import { BooleanIcon } from '@/app/components/BooleanIcon';
import React from 'react';

interface Props {
    value?: number;
}

export default function BooleanField({ value }: Props) {
    return <BooleanIcon checked={Boolean(value)} />;
}
