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
