'use client';

import Button from '@/app/components/Button/Button';
import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';

export default function CancelButton() {
    const { t } = useTranslation('general');
    const router = useRouter();

    return (
        <Button type="button" onClick={() => router.back()} preset="secondary">
            {capitalizeFirstLetter(t('cancel'))}
        </Button>
    );
}
