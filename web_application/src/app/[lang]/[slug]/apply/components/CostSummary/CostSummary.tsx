import MembershipCardCompact from '@/app/components/MembershipCard/MembershipCardCompact';
import { useApplication } from '@/hooks/application/useApplication';
import useTranslation from 'next-translate/useTranslation';
import { CostItemProps } from './CostItem';
import FeeSummary from './FeeSummary';
import { getMonthlyFeeItems, getTotalFee } from './utils';
import TextInput from '@/app/components/Input/TextInput';
import { ChangeEvent, useState } from 'react';

interface Props {
    handleInputChange: (name: string, value: string | number) => void;
    allowVoluntaryContribution: boolean;
}

const transformToFieldString = (value: number | undefined | null): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    return value.toString();
};

function CostSummary({ allowVoluntaryContribution, handleInputChange }: Props) {
    const { t } = useTranslation();
    const { application } = useApplication();
    const { membership, members } = application;
    const { membershipType } = membership;
    const [
        transformedVoluntaryContribution,
        setTransformedVoluntaryContribution,
    ] = useState<string>(
        transformToFieldString(membership.voluntaryContribution ?? 0),
    );

    const monthlyFeeItems: CostItemProps[] = [
        {
            label: t('application:summary.label.membership_fee', {
                title: membershipType.title,
            }),
            value: membership.membershipType.monthlyFee,
            withPrefix: false,
        },
    ];
    monthlyFeeItems.push(
        ...getMonthlyFeeItems(members, membershipType.divisionMembershipTypes),
    );

    const handleVoluntaryContributionChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target;
        const parsedValue = parseFloat(value);

        setTransformedVoluntaryContribution(
            transformToFieldString(parsedValue),
        );

        handleInputChange(name, isNaN(parsedValue) ? 0 : parsedValue);
    };

    if (
        allowVoluntaryContribution &&
        membership.voluntaryContribution != null &&
        membership.voluntaryContribution > 0
    ) {
        monthlyFeeItems.push({
            label: t('application:summary.label.voluntary_contribution'),
            value: membership.voluntaryContribution,
        });
    }

    const oneTimeFeeItems: CostItemProps[] = [];

    if (membershipType.admissionFee) {
        oneTimeFeeItems.push({
            label: t('membership_type:admission_fee.label'),
            value: membershipType.admissionFee ?? 0,
            withPrefix: false,
        });
    }

    return (
        <>
            <MembershipCardCompact
                monthlyFee={getTotalFee(monthlyFeeItems)}
                title={membershipType.title}
                minimumNumberOfMonths={membershipType.minimumNumberOfMonths}
                index={0}
            />
            {allowVoluntaryContribution && (
                <div className="mt-4">
                    <TextInput
                        id="voluntaryContribution"
                        name="voluntaryContribution"
                        value={transformedVoluntaryContribution}
                        label={t('membership:voluntary_contribution.label')}
                        help={t('resource:fields.currency.help')}
                        type="number"
                        min="0"
                        step={0.01}
                        onChange={handleVoluntaryContributionChange}
                    />
                </div>
            )}
            {monthlyFeeItems.length > 0 && (
                <FeeSummary
                    label={t('application:summary.label.monthly_fee')}
                    items={monthlyFeeItems}
                />
            )}
            {oneTimeFeeItems.length > 0 && (
                <FeeSummary
                    label={t('application:summary.label.one_time_fee')}
                    items={oneTimeFeeItems}
                />
            )}
        </>
    );
}

export default CostSummary;
