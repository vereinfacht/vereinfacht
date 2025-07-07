import CurrencyText from '../Text/CurrencyText';
import { TextPresets } from '../Text/Text';
import TextCell, { TextCellProps } from './TextCell';

interface Props extends TextCellProps {
    value: number;
    preset?: TextPresets;
}

export default function CurrencyCell({ value, ...props }: Props) {
    return (
        <TextCell {...props} className="text-right">
            <CurrencyText value={value} />
        </TextCell>
    );
}
