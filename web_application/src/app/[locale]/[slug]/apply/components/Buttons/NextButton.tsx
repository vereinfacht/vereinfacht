'use client';
import { useTranslations } from 'next-intl';
import Button from '@/app/components/Button/Button';
import IconArrow from '/public/svg/arrow.svg';
import { scrollToTop } from '@/utils/scrolling';

export default function NextButton() {
    const t = useTranslations();

    return (
        <Button
            type="submit"
            onClick={scrollToTop}
            icon={<IconArrow width={16} height={16} data-cy="next-button" />}
        >
            {t('application.next')}
        </Button>
    );
}
