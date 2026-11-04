import { useTranslations } from 'next-intl';
import Text from '@/app/components/Text/Text';
import Card from '@/app/components/Card/Card';

interface Props {
    url: string;
    logoUrl: string;
}

export default function CardVisitClubWebsite({ url, logoUrl }: Props) {
    const t = useTranslations();

    return (
        <Card>
            <a
                href={url}
                target="_blank"
                className="flex h-full flex-col items-center justify-center p-4"
            >
                <picture>
                    <img
                        src={logoUrl}
                        alt={`Club Logo`}
                        height={48}
                        width={48}
                        className="mb-2"
                    />
                </picture>
                <Text preset="headline" tag="h3" className="text-headline">
                    {t('admin.visit_club_website')}
                </Text>
            </a>
        </Card>
    );
}
