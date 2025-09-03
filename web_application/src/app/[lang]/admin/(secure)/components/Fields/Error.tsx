import Text from '@/app/components/Text/Text';
import React from 'react';

interface Props {
    error: string;
}

export default function Error({ error }: Props) {
    return (
        <Text preset="error" className="pl-2">
            {error}
        </Text>
    );
}
