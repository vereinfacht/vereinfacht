import { Club } from '@/types/models';
import Text from './Text/Text';
import useTranslation from 'next-translate/useTranslation';
import styles from './ClubHeader.module.css';

export interface ClubHeaderProps {
    club: Club;
    showCard?: boolean;
}

export default function ClubHeader({ club, showCard = true }: ClubHeaderProps) {
    const { t } = useTranslation('application');

    return (
        <header
            className={[
                'mb-2 overflow-hidden pt-4 md:pt-6',
                showCard &&
                    'bg-gradient-to-b from-white via-white to-slate-400',
            ].join(' ')}
        >
            <div className="mb-4 flex max-w-4xl flex-col gap-4 px-6 md:mx-auto md:mb-6 md:flex-row md:items-center md:gap-6">
                {Boolean(club.logoUrl) && (
                    <picture>
                        <img
                            src={club.logoUrl}
                            alt={`Logo ${club.title}`}
                            height={48}
                            width={48}
                        />
                    </picture>
                )}
                <div className="flex-1">
                    <Text
                        tag="h1"
                        className="text-md font-semibold leading-tight md:text-[1.375rem]"
                    >
                        {club.title}
                    </Text>
                    <Text
                        tag="h2"
                        preset="display-light"
                        className="text-base text-slate-600 md:text-xl"
                    >
                        {club.applyTitle != undefined &&
                        club.applyTitle.length > 0 ? (
                            <span
                                className={styles.description}
                                dangerouslySetInnerHTML={{
                                    __html: club.applyTitle,
                                }}
                            />
                        ) : (
                            t('header_subline')
                        )}
                    </Text>
                </div>
            </div>
            {showCard && (
                <div className="h-6 w-full rounded-t-3xl bg-white"></div>
            )}
        </header>
    );
}
