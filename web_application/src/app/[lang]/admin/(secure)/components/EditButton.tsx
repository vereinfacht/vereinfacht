import Button from '@/app/components/Button/Button';
import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

interface Props {
    href: string;
    disabled?: boolean;
}

export default function EditButton({ href, disabled }: Props) {
    const { t } = useTranslation();

    return (
        <Button className="self-start" href={href} disabled={disabled}>
            {capitalizeFirstLetter(t('general:edit'))}
        </Button>
    );
}
