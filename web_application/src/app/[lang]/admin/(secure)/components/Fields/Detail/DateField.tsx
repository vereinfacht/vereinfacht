import Empty from '@/app/components/Empty';
import Text from '@/app/components/Text/Text';
import { formatDate } from '@/utils/dates';
import { SupportedLocale } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

interface Props {
    value?: string;
}

export default function DateField({ value }: Props) {
    const { lang } = useTranslation();

    if (value == null || value === '') {
        return <Empty text={'–'} />;
    }

    return (
        <Text className="hyphens-auto whitespace-break-spaces">
            {formatDate(value, lang as SupportedLocale)}
        </Text>
    );
}
