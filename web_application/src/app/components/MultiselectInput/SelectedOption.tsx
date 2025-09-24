import { Option } from '../Input/SelectInput';
import IconTrash from '/public/svg/trash.svg';

interface Props {
    option: Option;
    handleRemove: () => void;
}

export default function SelectedOption({ option, handleRemove }: Props) {
    return (
        <li className="mt-1 flex items-end justify-between gap-4 border-b border-dashed border-b-slate-600">
            <div className="w-11/12">{option.label}</div>
            <IconTrash
                className="h-9 w-9 cursor-pointer stroke-red-500 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                onClick={handleRemove}
            />
        </li>
    );
}
