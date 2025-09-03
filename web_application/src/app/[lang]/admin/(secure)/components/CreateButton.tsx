import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import { ButtonHTMLAttributes } from 'react';
import Button from '../../../../components/Button/Button';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    href: string;
};

export default function CreateButton(props: Props) {
    const { t } = useTranslation();

    return (
        <Button
            className="mb-6 w-fit"
            data-cy="create-button"
            {...props}
            type={props.type ?? 'button'}
        >
            {capitalizeFirstLetter(t('general:create'))}
        </Button>
    );
}
