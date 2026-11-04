import { useLocale } from 'next-intl';
import Empty from '@/app/components/Empty';
import Text from '@/app/components/Text/Text';
import { formatDate } from '@/utils/dates';
import type { SupportedLocale } from '@/i18n/routing';
import React from 'react';

interface Props {
    value?: string;
}

export default function DateField({ value }: Props) {
    const lang = useLocale();

    if (value == null || value === '') {
        return <Empty text={'–'} />;
    }

    return (
        <Text className="hyphens-auto whitespace-break-spaces">
            {formatDate(value, lang as SupportedLocale)}
        </Text>
    );
}
