import { Button } from '@/app/components/ui/button';
import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import { ButtonHTMLAttributes } from 'react';
import IconPlus from '/public/svg/plus_new.svg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    href: string;
};

export default function CreateButton({ href, ...props }: Props) {
    const { t } = useTranslation();

    return (
        <Button
            className="text-white-solid mx-1 my-6 w-fit"
            size={'default'}
            data-cy="create-button"
            leftIcon={<IconPlus />}
            render={<a href={href} />}
        >
            {capitalizeFirstLetter(t('general:create'))}
        </Button>
    );
}
