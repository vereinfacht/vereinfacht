import { getTranslations } from 'next-intl/server';
import NotFoundContent from './_components/not-found-content';
import { capitalizeFirstLetter } from '@/utils/strings';

export default async function NotFoundPage() {
    const t = await getTranslations();
    return (
        <NotFoundContent
            headline={t('error.status.404.headline')}
            subline={t('error.status.404.subline')}
            description={t('error.status.404.description')}
            backLabel={capitalizeFirstLetter(t('general.back'))}
        />
    );
}
