'use client';

import { useMembershipSwiper } from '@/hooks/membershipSwiper/useMembershipSwiper';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import CardItem from '../MembershipCard/CardItem';
import Text from '../Text/Text';
import styles from './DivisionList.module.css';
import List from './List';
import IconChevronDown from '/public/svg/chevron_down.svg';
import { Division, DivisionMembershipType } from '@/types/models';

interface Props {
    clubDivisions: Division[];
    divisionMembershipTypes?: DivisionMembershipType[];
}

const MINIMUM_DIVISIONS_FOR_PREVIEW = 4;
const PREVIEWED_DIVISIONS_COUNT = 3; // only two of them are in fact readable

function getTranslationKey(
    totalDivisionCount: number,
    includedDivisionsCount: number,
) {
    if (includedDivisionsCount === 0) {
        return 'membership:divisions_none';
    }

    if (includedDivisionsCount === totalDivisionCount) {
        return 'membership:divisions_all';
    }

    if (includedDivisionsCount >= Math.ceil(totalDivisionCount / 2)) {
        return 'membership:divisions_most';
    }

    return 'membership:divisions_some';
}

function ListHeadline({
    total,
    included,
}: {
    total: number;
    included: number;
}) {
    return (
        <CardItem hasLine>
            <Trans
                i18nKey={getTranslationKey(total, included)}
                components={[<span key="0" className={'font-semibold'} />]}
            />
        </CardItem>
    );
}

function DivisionsList({ clubDivisions, divisionMembershipTypes }: Props) {
    const { t } = useTranslation('membership');
    const { showDivisions, setShowDivisions } = useMembershipSwiper();

    const membershipTypeDivisionIds =
        divisionMembershipTypes
            ?.map(
                (divisionMembershipType) => divisionMembershipType.division?.id,
            )
            .filter((id) => id !== undefined) ?? [];

    const includedDivisionsCount =
        clubDivisions.filter((division) =>
            membershipTypeDivisionIds.includes(division.id),
        ).length ?? 0;

    if (clubDivisions.length < MINIMUM_DIVISIONS_FOR_PREVIEW) {
        return (
            <div className="mt-4 px-8">
                <ListHeadline
                    total={clubDivisions.length}
                    included={includedDivisionsCount}
                />
                <List
                    clubDivisions={clubDivisions}
                    divisionMembershipTypes={divisionMembershipTypes}
                    className="relative mt-2 overflow-hidden pb-2"
                />
            </div>
        );
    }

    const previewedDivisions = clubDivisions?.slice(
        0,
        PREVIEWED_DIVISIONS_COUNT,
    );
    const remainingDivisions = clubDivisions?.slice(PREVIEWED_DIVISIONS_COUNT);

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setShowDivisions(!showDivisions);
    };

    return (
        <div className="relative mb-8 mt-4 overflow-hidden">
            <details className="px-8" open={showDivisions}>
                <summary
                    className={[styles.summary, 'cursor-pointer'].join(' ')}
                    onClick={handleClick}
                >
                    <ListHeadline
                        total={clubDivisions.length}
                        included={includedDivisionsCount}
                    />
                    <List
                        clubDivisions={previewedDivisions}
                        divisionMembershipTypes={divisionMembershipTypes}
                        className="mt-2"
                        withLastLine
                    />
                </summary>
                {remainingDivisions !== undefined &&
                    remainingDivisions?.length > 0 &&
                    showDivisions && (
                        <List
                            clubDivisions={remainingDivisions}
                            divisionMembershipTypes={divisionMembershipTypes}
                            className="animate-fade-in pb-12"
                        />
                    )}
            </details>
            <button
                className={[
                    'absolute bottom-0 flex w-full items-center justify-center gap-2 bg-linear-to-b from-white/40 via-white/60 to-white px-8 py-[0.32rem] text-center text-slate-600 backdrop-blur-[0.2rem]',
                    showDivisions
                        ? 'rounded-b-2xl shadow-inset-sm'
                        : 'rounded-t-2xl shadow-negative-sm',
                ].join(' ')}
                type="button"
                aria-label="Toggle showing all divisions"
                onClick={handleClick}
            >
                <Text preset="label">{t(showDivisions ? 'hide' : 'show')}</Text>
                <IconChevronDown
                    width={24}
                    height={24}
                    className={[
                        'stroke-current stroke-2 text-slate-600 transition-transform duration-300 [stroke-linecap:round] [stroke-linejoin:round]',
                        showDivisions ? 'rotate-180 transform' : '',
                    ].join(' ')}
                />
            </button>
        </div>
    );
}

export default DivisionsList;
