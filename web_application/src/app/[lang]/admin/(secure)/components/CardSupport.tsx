import Text from '@/app/components/Text/Text';
import React, { ReactElement } from 'react';
import Card from '@/app/components/Card/Card';
import Logo from '/public/svg/vereinfacht_signet.svg';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    url: string;
    title: string;
    text: string;
    icon: ReactElement;
}

export default function CardSupport({ url, icon, title, text }: Props) {
    const { t } = useTranslation('admin');

    return (
        <Card>
            <a href={url} target="_blank" className="flex h-full flex-col p-4">
                <div className="relative w-full">
                    <Logo className="absolute top-0 left-0 mb-1 h-5 fill-current" />
                </div>
                <div className="flex flex-1 flex-col items-center justify-center">
                    {icon}
                    <Text tag="h3">{t(title)}:</Text>
                    <Text preset="headline" className="text-headline">
                        {t(text)}
                    </Text>
                </div>
            </a>
        </Card>
    );
}
