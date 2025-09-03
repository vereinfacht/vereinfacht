'use client';

import { useCallback, useEffect, useState } from 'react';
import MultiselectInput from '../MultiselectInput/MultiselectInput';
import CurrencyText from '../Text/CurrencyText';
import Text from '../Text/Text';
import { Option } from './SelectInput';

interface Props {
    id: string;
    name?: string;
    label?: string | React.ReactNode;
    defaultValue?: Option[];
    onChange?: (selected: Option[]) => void;
    required?: boolean;
    resource?: string;
}

export default function BelongsToMultiselectInput({
    id,
    name,
    label,
    defaultValue,
    onChange,
    required = false,
    resource,
}: Props) {
    const [options, setOptions] = useState<Option[]>([]);
    const [query, setQuery] = useState('');

    // @todo: use server action or other fetch handling
    const fetchOptions = useCallback(
        async (searchTerm: string) => {
            if (!resource) return;

            try {
                const response = await fetch(
                    `http://api.verein.localhost/api/v1/${resource}?filter[query]=${encodeURIComponent(
                        searchTerm,
                    )}&filter[withoutReceipts]=true`,
                    {
                        headers: {
                            Accept: 'application/vnd.api+json',
                            'Content-Type': 'application/vnd.api+json',
                            Authorization: `Bearer`,
                        },
                    },
                );

                if (!response.ok)
                    throw new Error(`API error: ${response.status}`);

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
                                <div className="flex w-10/12 gap-2">
                                    <Text className="min-w-fit font-medium">
                                        {item.attributes.name}
                                    </Text>
                                    <Text className="truncate">
                                        {item.attributes.description}
                                    </Text>
                                </div>
                                <CurrencyText value={item.attributes.amount} />
                            </div>
                        ),
                    }),
                );

                setOptions(newOptions.slice(0, 10));
            } catch (error) {
                console.error('Error fetching options:', error);
                setOptions([]);
            }
        },
        [resource],
    );

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchOptions(query);
        }, 400);
        return () => clearTimeout(handler);
    }, [query, fetchOptions]);

    useEffect(() => {
        fetchOptions('');
    }, [fetchOptions]);

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
