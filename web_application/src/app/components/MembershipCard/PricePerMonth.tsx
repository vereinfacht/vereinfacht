import useCurrency from '@/hooks/useCurrency';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Text from '../Text/Text';

interface Props {
    price: number;
    duration?: number;
}

export default function PricePerMonth({ price, duration }: Props) {
    const { t } = useTranslation('membership');
    const { getValue, getSymbol } = useCurrency();
    const priceValue = getValue(price);
    const priceSymbol = getSymbol();

    return (
        <div className="flex items-end text-4xl">
            <div className="mb-[0.28em] mr-[1em] text-right text-[0.4em] text-white/80 dark:text-slate-900/60">
                <Text preset="label">{t('per_month')}</Text>

                {Boolean(duration) && (
                    <Text className="text-xs">
                        <Trans
                            i18nKey="membership:minimum_month_count"
                            components={[<span key="0" />]}
                            values={{ count: duration }}
                        />
                    </Text>
                )}
            </div>
            <Text preset="display-light">
                {priceValue}
                <span className="ml-[0.12em] text-white/50 dark:text-slate-900/40">
                    {priceSymbol}
                </span>
            </Text>
        </div>
    );
}
