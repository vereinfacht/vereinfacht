'use client';

import { ComboboxOptions, Transition } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import React, { Fragment } from 'react';
import { Option } from '../Input/SelectInput';
import MultiselectOption from './MultiselectOption';

interface Props {
    options: Option[];
}

export default function Options({ options }: Props) {
    const { t } = useTranslation();

    return (
        <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <ComboboxOptions
                className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                static
            >
                {options.length === 0 ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        {t('general:nothing_found')}
                    </div>
                ) : (
                    options.map((option) => (
                        <MultiselectOption key={option.value} option={option} />
                    ))
                )}
            </ComboboxOptions>
        </Transition>
    );
}
