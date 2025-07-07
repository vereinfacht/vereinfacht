'use client';
import Button from '@/app/components/Button/Button';
import useTranslation from 'next-translate/useTranslation';
import IconArrow from '/public/svg/arrow.svg';
import { scrollToTop } from '@/utils/scrolling';

export default function NextButton() {
    const { t } = useTranslation();

    return (
        <Button
            type="submit"
            onClick={scrollToTop}
            icon={<IconArrow width={16} height={16} data-cy="next-button" />}
        >
            {t('application:next')}
        </Button>
    );
}
