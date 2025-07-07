'use client'; // Error components must be Client components

import Button from '@/app/components/Button/Button';
import Text from '@/app/components/Text/Text';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import IconRefresh from '/public/svg/refresh.svg';
import MessageBox from './components/MessageBox';

interface Props {
    error: Error;
    reset?: () => void;
}

export default function Error({ error, reset }: Props) {
    const { t } = useTranslation('error');

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="mx-auto my-10 max-w-md px-6">
            <Text preset="headline">{t('headline')}</Text>
            <Text>{t('description')}</Text>
            {Boolean(error?.message) && (
                <MessageBox
                    preset="error"
                    className="my-10 w-full"
                    message={error.message}
                />
            )}
            {Boolean(reset) && (
                <Button
                    icon={<IconRefresh className="h-5 w-5 stroke-slate-900" />}
                    onClick={() => (reset ? reset() : null)}
                    iconLeft
                    className="mx-auto"
                >
                    {t('try_again')}
                </Button>
            )}
        </div>
    );
}
