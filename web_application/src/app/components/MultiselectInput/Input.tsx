'use client';

import { ComboboxButton, ComboboxInput } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { Option } from '../Input/SelectInput';
import IconSearch from '/public/svg/search.svg';

interface Props {
    setQuery: (query: string) => void;
    required?: boolean;
}

export default function Input({ setQuery, required = false }: Props) {
    const { t } = useTranslation();

    return (
        <div className="relative w-full cursor-default rounded-md bg-slate-300 text-left shadow-input placeholder:text-slate-600 focus-within:ring-2 focus-within:ring-slate-600">
            <ComboboxInput
                className="w-full border-none bg-transparent p-3 pr-10 outline-none"
                displayValue={(option: Option) => option.label}
                placeholder={t('general:search_select')}
                onChange={(event) => setQuery(event.target.value)}
                multiple
                required={required}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <IconSearch
                    className="stroke-slate-600 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                    aria-hidden="true"
                />
            </ComboboxButton>
        </div>
    );
}
