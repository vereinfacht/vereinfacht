'use client';

import { getDefaultMetadata } from '@/utils/metadata';
import Text from '@/app/components/Text/Text';
import useTranslation from 'next-translate/useTranslation';
import IconCheck from '/public/svg/broken_url.svg';
import { Metadata } from 'next';
import Button from './components/Button/Button';
import { capitalizeFirstLetter } from '@/utils/strings';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
    ...getDefaultMetadata(),
    title: '404',
};

export default function NotFoundPage() {
    const { t } = useTranslation('error');
    const router = useRouter();

    return (
        <div className="flex min-h-screen w-full justify-center p-6">
            <div className="flex flex-col items-center gap-8 self-center">
                <Text preset="display-light" tag="h1">
                    {t('status.404.headline')}
                </Text>
                <div className="flex items-center gap-4">
                    <IconCheck className="h-12 stroke-red-500 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
                    <Text preset="headline" tag="h2">
                        {t('status.404.subline')}
                    </Text>
                </div>
                <Text className="text-center">
                    {t('status.404.description')}
                </Text>
                <Button
                    onClick={() => {
                        router.back();
                    }}
                >
                    {capitalizeFirstLetter(t('general:back'))}
                </Button>
            </div>
        </div>
    );
}
