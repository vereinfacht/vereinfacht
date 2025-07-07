import Text from '@/app/components/Text/Text';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import Card from '@/app/components/Card/Card';

interface Props {
    url: string;
    logoUrl: string;
}

export default function CardVisitClubWebsite({ url, logoUrl }: Props) {
    const { t } = useTranslation('admin');

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
                <Text preset="headline" tag="h3">
                    {t('visit_club_website')}
                </Text>
            </a>
        </Card>
    );
}
