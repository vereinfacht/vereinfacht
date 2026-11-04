import { useTranslations } from 'next-intl';
import Button from '@/app/components/Button/Button';
import { capitalizeFirstLetter } from '@/utils/strings';

interface Props {
    href: string;
    disabled?: boolean;
}

export default function EditButton({ href, disabled }: Props) {
    const t = useTranslations();

    return (
        <Button className="self-start" href={href} disabled={disabled}>
            {capitalizeFirstLetter(t('general.edit'))}
        </Button>
    );
}
