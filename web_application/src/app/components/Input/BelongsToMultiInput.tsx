'use client';

import { useEffect, useState } from 'react';
import MultiselectInput from '../MultiselectInput/MultiselectInput';
import { Option } from '../Input/SelectInput';
import CurrencyText from '../Text/CurrencyText';
import Text from '../Text/Text';

interface Props {
    id: string;
    name?: string;
    label?: string | React.ReactNode;
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
    if (!resource) return null;

    const [options, setOptions] = useState<Option[]>([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchOptions(query);
        }, 400);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        fetchOptions('');
    }, []);

    const fetchOptions = async (searchTerm: string) => {
        try {
            const response = await fetch(
                `http://api.verein.localhost/api/v1/${resource}?filter[query]=${encodeURIComponent(
                    searchTerm,
                )}`,
                {
                    headers: {
                        Accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                        Authorization: `Bearer`,
                    },
                },
            );

            if (!response.ok) throw new Error(`API error: ${response.status}`);

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
                        <div className="flex justify-between">
                            <div className="flex w-10/12 gap-2 overflow-hidden">
                                <Text
                                    className={`font-semibold ${
                                        item.attributes.name.length > 80
                                            ? 'truncate'
                                            : ''
                                    }`}
                                >
                                    {item.attributes.name}
                                </Text>
                                <Text
                                    className={`font-normal ${
                                        item.attributes.description.length > 40
                                            ? 'truncate'
                                            : ''
                                    }`}
                                >
                                    {item.attributes.description}
                                </Text>
                            </div>
                            <CurrencyText
                                className="self-end"
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

    return (
        <MultiselectInput
            id={id}
            name={name}
            label={label}
            options={options}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            onQueryChange={setQuery}
        />
    );
}
