'use client';
import { useTranslations } from 'next-intl';
import Button from '@/app/components/Button/Button';
import IconArrow from '/public/svg/arrow.svg';
import { capitalizeFirstLetter } from '@/utils/strings';

interface BackButtonProps {
    onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
    const t = useTranslations();

    return (
        <Button
            preset={'secondary'}
            onClick={onClick}
            icon={<IconArrow width={16} height={16} className="rotate-180" />}
            iconLeft
            data-cy="back-button"
        >
            {capitalizeFirstLetter(t('general.back'))}
        </Button>
    );
}
