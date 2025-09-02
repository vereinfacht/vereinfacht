'use client';

import { sortByKey } from '@/utils/objects';
import { Combobox } from '@headlessui/react';
import { ReactNode, useEffect, useState } from 'react';
import InputLabel from '../Input/InputLabel';
import { Option } from '../Input/SelectInput';
import Input from './Input';
import Options from './Options';
import SelectedOptions from './SelectedOptions';

interface Props {
    id: string;
    name?: string;
    options: Option[];
    label?: string | ReactNode;
    defaultValue?: Option[];
    onChange?: (selected: Option[]) => void;
    onQueryChange?: (query: string) => void;
    required?: boolean;
}

export function filterOptionsByQuery(options: Option[], query: string) {
    if (query === '') {
        return options;
    }

    return options.filter((option) =>
        typeof option.label === 'string'
            ? option.label
                  .toLowerCase()
                  .replace(/\s+/g, '')
                  .includes(query.toLowerCase().replace(/\s+/g, ''))
            : option.label,
    );
}

export function sortOptions(options: Option[]) {
    return sortByKey<Option>(options, 'label');
}

export default function MultiselectInput({
    label,
    id,
    name,
    options: unsortedOptions,
    defaultValue,
    onChange,
    onQueryChange,
    required = false,
}: Props) {
    const options = sortOptions(unsortedOptions);
    const [selected, setSelected] = useState<Option[]>(defaultValue || []);
    const [query, setQuery] = useState('');
    const filteredOptions = onQueryChange
        ? options
        : filterOptionsByQuery(options, query);

    useEffect(() => {
        if (onChange) {
            onChange(selected);
        }
    }, [selected, onChange]);

    const handleRemove = (removedOption: Option) => {
        setSelected(
            selected.filter((option) => option.value !== removedOption.value),
        );
    };

    return (
        <div className="flex flex-col items-start">
            {label ? (
                typeof label === 'string' ? (
                    <InputLabel
                        forInput={id}
                        value={label}
                        required={required}
                    />
                ) : (
                    label
                )
            ) : null}
            <Combobox
                immediate
                value={selected}
                onChange={setSelected}
                name={name}
                multiple
                by="value"
                onClose={() => setQuery('')}
            >
                {({ open }) => (
                    <>
                        <div className="relative mt-1 w-full">
                            <Input
                                setQuery={(query) => {
                                    setQuery(query);
                                    if (onQueryChange) {
                                        onQueryChange(query);
                                    }
                                }}
                            />
                            {open && <Options options={filteredOptions} />}
                        </div>
                        {selected.length > 0 && (
                            <SelectedOptions
                                options={selected}
                                handleRemove={handleRemove}
                            />
                        )}
                        {required && (
                            <input
                                type="text"
                                name={name}
                                value={
                                    selected.length
                                        ? JSON.stringify(
                                              selected.map(
                                                  (option) => option.value,
                                              ),
                                          )
                                        : ''
                                }
                                required
                                className="pointer-events-none absolute opacity-0"
                                tabIndex={-1}
                            />
                        )}
                    </>
                )}
            </Combobox>
        </div>
    );
}
