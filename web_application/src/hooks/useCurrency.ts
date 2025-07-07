import useTranslation from 'next-translate/useTranslation';
type NumberFormatPartNames = 'currency' | 'decimal' | 'integer' | 'fraction';

export default function useCurrency(currency = 'EUR') {
    const { lang } = useTranslation();

    const formatter = new Intl.NumberFormat(lang, {
        style: 'currency',
        currency,
    });

    function getParts(price: number) {
        return formatter.formatToParts(price);
    }

    const getPartValueByName = (price: number, name: NumberFormatPartNames) => {
        return getParts(price).find((part) => part.type === name)?.value || '';
    };

    function getFormatted(price: number) {
        return formatter.format(price);
    }

    function getValue(price: number) {
        return getParts(price)
            .filter((part) => !['literal', 'currency'].includes(part.type))
            .map((part) => part.value)
            .join('');
    }

    function getSymbol() {
        return getPartValueByName(0, 'currency');
    }

    return {
        getFormatted,
        getValue,
        getSymbol,
    };
}
