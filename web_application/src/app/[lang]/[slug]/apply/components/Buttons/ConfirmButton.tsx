'use client';
import Button from '@/app/components/Button/Button';
import useTranslation from 'next-translate/useTranslation';
import IconCheck from '/public/svg/check.svg';

interface ConfirmButtonProps {
    isLoading: boolean;
}
export default function ConfirmButton({ isLoading }: ConfirmButtonProps) {
    const { t } = useTranslation();

    return (
        <Button
            type="submit"
            isLoading={isLoading}
            icon={<IconCheck width={16} height={16} />}
            data-cy="confirm-button"
        >
            {t('application:confirm')}
        </Button>
    );
}
