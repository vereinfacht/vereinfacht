'use client';
import { useTranslations } from 'next-intl';

import Button from '@/app/components/Button/Button';
import { capitalizeFirstLetter } from '@/utils/strings';
import { useRouter } from 'next/navigation';

export default function CancelButton() {
    const t = useTranslations();
    const router = useRouter();

    return (
        <Button type="button" onClick={() => router.back()} preset="secondary">
            {capitalizeFirstLetter(t('general.cancel'))}
        </Button>
    );
}
