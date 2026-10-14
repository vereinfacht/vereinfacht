'use client';

import { Button, ButtonProps } from '@/app/components/ui/button';
import { capitalizeFirstLetter } from '@/utils/strings';
import { useFormStatus } from 'react-dom';

interface Props extends ButtonProps {
    title: string;
}

export default function SubmitButton({
    title,
    isLoading,
    ...props
}: Props) {
    const { pending } = useFormStatus();

    return (
        <Button
            {...props}
            type="submit"
            isLoading={pending || isLoading}
            data-cy="submit-button"
        >
            {capitalizeFirstLetter(title)}
        </Button>
    );
}
