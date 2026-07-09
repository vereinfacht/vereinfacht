'use client';

import Button from '@/app/components/Button/Button';
import { ButtonPresets } from '@/app/components/Button/presets';
import { capitalizeFirstLetter } from '@/utils/strings';
import { ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    preset?: ButtonPresets;
    loading?: boolean;
}

export default function SubmitButton({
    title,
    preset = 'primary',
    loading,
    ...props
}: Props) {
    const { pending } = useFormStatus();
    const isLoading = pending || loading;

    return (
        <Button
            {...props}
            type="submit"
            isLoading={isLoading}
            data-cy="submit-button"
            preset={preset}
        >
            {capitalizeFirstLetter(title)}
        </Button>
    );
}
