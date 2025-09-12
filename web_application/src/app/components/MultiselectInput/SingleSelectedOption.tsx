import { X } from 'lucide-react';
import { Option } from '../Input/SelectInput';
import Text from '../Text/Text';

interface Props {
    option: Option;
    handleRemove: () => void;
}

export default function SingleSelectedOption({ option, handleRemove }: Props) {
    return (
        <div
            className="border-radius-6 absolute inset-0 m-1 flex w-fit cursor-pointer items-center gap-2 rounded-md border border-slate-500 bg-white pl-2 pr-2"
            onClick={handleRemove}
        >
            <Text preset="label">{option.label}</Text>
            <X className="h-4 w-4 stroke-slate-600 stroke-2" />
        </div>
    );
}
