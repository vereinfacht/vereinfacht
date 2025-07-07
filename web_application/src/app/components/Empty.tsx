import React from 'react';
import Text from './Text/Text';

export default function Empty({ text }: { text: string }) {
    return <Text preset="body-sm">{text}</Text>;
}
