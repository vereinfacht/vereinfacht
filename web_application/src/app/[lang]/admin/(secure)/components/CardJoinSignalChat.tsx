import Text from '@/app/components/Text/Text';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import Card from '@/app/components/Card/Card';
import Logo from '/public/svg/vereinfacht_signet.svg';
import SignalLogo from '/public/svg/signal_logo.svg';

interface Props {
    url: string;
}

export default function CardJoinSignalChat({ url }: Props) {
    const { t } = useTranslation('admin');

    return (
        <Card className="col-start-1">
            <a
                href={url}
                target="_blank"
                className="relative z-0 flex h-full flex-col items-start justify-between bg-blue-500 p-4 text-white"
            >
                <SignalLogo className="absolute -right-24 -top-28 z-[-1] h-80 w-80" />
                <Logo className="mb-1 h-5 fill-current" />
                <div>
                    <Text preset="headline" className="text-xl" tag="h3">
                        {t('join_signal_chat_title')}
                    </Text>
                    <Text preset="body-sm" className="opacity-90">
                        {t('join_signal_chat_description')}
                    </Text>
                </div>
            </a>
        </Card>
    );
}
