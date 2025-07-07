import Text from '@/app/components/Text/Text';
import useCurrency from '@/hooks/useCurrency';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    totalDivisionCosts: number;
}

function TotalDivisionCosts({ totalDivisionCosts }: Props) {
    const { t } = useTranslation('application');
    const { getFormatted } = useCurrency();
    const shown = totalDivisionCosts > 0;

    return (
        <div
            className={[
                'mb-4 transition-opacity duration-300',
                shown ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
        >
            <Text preset="body-sm">
                {t('application:total_division_costs')}
                {':'}
                <span className="ml-2 font-semibold">
                    {getFormatted(totalDivisionCosts)}
                </span>
            </Text>
        </div>
    );
}

export default TotalDivisionCosts;
