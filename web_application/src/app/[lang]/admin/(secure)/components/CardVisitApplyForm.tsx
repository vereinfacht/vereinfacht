import Text from '@/app/components/Text/Text';
import { usePattern } from '@/hooks/usePattern';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import Card from '@/app/components/Card/Card';

interface Props {
    url: string;
}

export default function CardVisitApplyForm({ url }: Props) {
    const { t } = useTranslation('admin');
    const pattern = usePattern(1);

    return (
        <Card>
            <a
                href={url}
                target="_blank"
                className="relative flex h-full items-center justify-center p-4"
            >
                <div className="absolute inset-0 origin-center -rotate-6 scale-150 overflow-hidden">
                    {pattern}
                </div>
                <Text
                    preset="headline"
                    tag="h3"
                    className="relative text-center text-white dark:text-slate-900"
                >
                    {t('visit_apply_form')}
                </Text>
            </a>
        </Card>
    );
}
