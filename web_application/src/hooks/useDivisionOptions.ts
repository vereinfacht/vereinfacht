import { Option } from '@/app/components/Input/SelectInput';
import useTranslation from 'next-translate/useTranslation';
import { Application } from './application/ApplicationProvider';
import useCurrency from './useCurrency';
import { Division } from '@/types/models';

export function useDivisionOptions(application: Application) {
    const { t } = useTranslation();
    const { getFormatted } = useCurrency();
    const membershipType = application.membership.membershipType;
    const notIncludedString = ` (${t('membership:division_not_included', {
        title: membershipType?.title,
    })})`;

    function getOptions(divisions: Division[]): Option[] {
        return divisions.map((division) => divisionToOption(division));
    }

    function divisionToOption(division: Division): Option {
        const value = division.id;
        const divisionMembershipType =
            membershipType?.divisionMembershipTypes?.find(
                (divisionMembershipType) =>
                    divisionMembershipType.division?.id === division.id,
            );

        if (divisionMembershipType === undefined) {
            const label = `${division.title}${notIncludedString}`;

            return {
                value,
                label,
                disabled: true,
            };
        }

        const { monthlyFee } = divisionMembershipType;

        if (monthlyFee === undefined || monthlyFee < 1) {
            return {
                value,
                label: division.title,
            };
        }

        const label = `${division.title} + ${getFormatted(monthlyFee)}`;

        return {
            value,
            label,
        };
    }

    return {
        getOptions,
    };
}
