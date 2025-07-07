import Text from '@/app/components/Text/Text';
import React from 'react';

interface Props {
    text: string;
    className?: string;
}

export default function HelpText({ text, className }: Props) {
    return (
        <Text
            preset="body-sm"
            className={['text-slate-600', className].join(' ')}
        >
            {text}
        </Text>
    );
}
