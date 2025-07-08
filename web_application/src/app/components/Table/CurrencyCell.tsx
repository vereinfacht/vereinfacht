import CurrencyText from '../Text/CurrencyText';

interface Props {
    value: number;
}

export default function CurrencyCell({ value }: Props) {
    return <CurrencyText suppressHydrationWarning value={value} />;
}
