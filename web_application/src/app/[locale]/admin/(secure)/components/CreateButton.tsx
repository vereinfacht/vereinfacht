import { useTranslations } from 'next-intl';
import { Button } from '@/app/components/ui/button';
import { capitalizeFirstLetter } from '@/utils/strings';
import { ButtonHTMLAttributes } from 'react';
import IconPlus from '/public/svg/plus_new.svg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    href: string;
};

export default function CreateButton({ href }: Props) {
    const t = useTranslations();

    return (
        <Button
            className="text-white-solid"
            size={'default'}
            data-cy="create-button"
            leftIcon={<IconPlus />}
            render={<a href={href} />}
        >
            {capitalizeFirstLetter(t('general.create'))}
        </Button>
    );
}
