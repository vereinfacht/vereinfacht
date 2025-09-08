'use client';

import Button from '@/app/components/Button/Button';
import { ButtonPresets } from '@/app/components/Button/presets';
import { capitalizeFirstLetter } from '@/utils/strings';
import { useFormStatus } from 'react-dom';

interface Props {
    title: string;
    preset?: ButtonPresets;
}

export default function SubmitButton({ title, preset = 'primary' }: Props) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            isLoading={pending}
            data-cy="submit-button"
            preset={preset}
        >
            {capitalizeFirstLetter(title)}
        </Button>
    );
}
