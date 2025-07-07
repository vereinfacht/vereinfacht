'use client';

import { ComboboxOption } from '@headlessui/react';
import React from 'react';
import { Option } from '../Input/SelectInput';
import IconCheck from '/public/svg/check.svg';

interface Props {
    option: Option;
}

export default function MultiselectOption({ option }: Props) {
    return (
        <ComboboxOption
            key={option.value}
            className={({ focus, disabled }) => {
                const baseClasses = 'relative select-none py-2 pl-10 pr-4';

                return [
                    baseClasses,
                    disabled
                        ? 'cursor-not-allowed text-slate-600'
                        : focus
                          ? 'cursor-default bg-slate-600 text-white'
                          : 'cursor-default text-slate-900',
                ].join(' ');
            }}
            value={option}
            disabled={option.disabled}
        >
            {({ selected, focus }) => (
                <>
                    <span
                        className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                        }`}
                    >
                        {option.label}
                    </span>
                    <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            focus ? 'text-white' : 'text-slate-600'
                        }`}
                    >
                        {selected && (
                            <IconCheck
                                className="h-5 w-5 stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                                aria-hidden="true"
                            />
                        )}
                    </span>
                </>
            )}
        </ComboboxOption>
    );
}
