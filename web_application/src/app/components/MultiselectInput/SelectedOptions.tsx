import React from 'react';
import { Option } from '../Input/SelectInput';
import SelectedOption from './SelectedOption';

interface Props {
    options: Option[];
    handleRemove: (option: Option) => void;
}

export default function SelectedOptions({ options = [], handleRemove }: Props) {
    return (
        <ul className="mt-2 w-full">
            {options.map((option) => (
                <SelectedOption
                    key={option.value}
                    option={option}
                    handleRemove={() => handleRemove(option)}
                />
            ))}
        </ul>
    );
}
