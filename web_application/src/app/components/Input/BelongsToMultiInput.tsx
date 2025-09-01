'use client';

import { Combobox } from '@headlessui/react';
import { ReactNode, useEffect, useState } from 'react';
import InputLabel from '../Input/InputLabel';
import { Option } from '../Input/SelectInput';
import Input from '../MultiselectInput/Input';
import Options from '../MultiselectInput/Options';
import SelectedOptions from '../MultiselectInput/SelectedOptions';
import CurrencyText from '../Text/CurrencyText';
import Text from '../Text/Text';

interface Props {
    id: string;
    name?: string;
    label?: string | ReactNode;
    defaultValue?: Option[];
    onChange?: (selected: Option[]) => void;
    required?: boolean;
    resource?: string;
}

export default function BelongsToMultiInput({
    id,
    name,
    label,
    defaultValue,
    onChange,
    required = false,
    resource,
}: Props) {
    const [selected, setSelected] = useState<Option[]>(defaultValue || []);
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchOptions(query);
        }, 400);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        fetchOptions('');
    }, []);

    useEffect(() => {
        if (onChange) {
            onChange(selected);
        }
    }, [selected, onChange]);

    const fetchOptions = async (searchTerm: string) => {
        try {
            const response = await fetch(
                `http://api.verein.localhost/api/v1/${resource}?filter[query]=${encodeURIComponent(searchTerm)}`,
                {
                    headers: {
                        Accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                        Authorization: `Bearer`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const json = await response.json();
            const newOptions: Option[] = json.data.map(
                (item: {
                    id: string;
                    attributes: {
                        name: string;
                        description: string;
                        amount: number;
                    };
                }) => ({
                    value: item.id,
                    label: (
                        <div className="grid grid-cols-[1fr_auto] gap-x-4">
                            <Text className="col-start-1 row-start-1 font-semibold">
                                {item.attributes.name}
                            </Text>
                            <Text className="col-start-1 row-start-2 line-clamp-1 truncate font-normal">
                                {item.attributes.description}
                            </Text>
                            <CurrencyText
                                className="col-start-2 row-span-2 self-end"
                                value={item.attributes.amount}
                            />
                        </div>
                    ),
                }),
            );

            setOptions(newOptions.slice(0, 10));
        } catch (error) {
            console.error('Error fetching options:', error);
            setOptions([]);
        }
    };

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
                            <Input setQuery={setQuery} />
                            {open && <Options options={options} />}
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
