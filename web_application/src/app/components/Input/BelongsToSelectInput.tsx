'use client';

import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { useCallback, useEffect, useState } from 'react';
import { NewMultiselectInput } from '../MultiselectInput/NewMultiselectInput';
import { Option } from './SelectInput';

export const itemsPerQuery = 6;

interface Props<T> {
    resourceName: string;
    resourceType: string;
    action: (searchTerm: string) => Promise<any>;
    optionLabel: (item: T) => React.ReactNode;
    label?: string | React.ReactNode;
    onChange?: () => void;
    required?: boolean;
    defaultValue?: Option[];
}

export default function BelongsToSelectInput<T>({
    resourceName,
    resourceType,
    label,
    action,
    optionLabel,
    defaultValue,
    required = false,
}: Props<T>) {
    const [options, setOptions] = useState<Option[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchOptions = useCallback(
        async (searchTerm: string) => {
            try {
                setLoading(true);
                const response = await action(searchTerm);

                const resources = deserialize(
                    response as DocumentObject,
                ) as T[];

                const newOptions: Option[] = resources.map((resource) => ({
                    // @ts-expect-error: T has no id property
                    value: resource.id,
                    label: optionLabel(resource as T),
                }));

                setOptions(newOptions);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error fetching options:', error);
                setOptions([]);
            }
        },
        [optionLabel, action],
    );

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchOptions(query);
        }, 400);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        fetchOptions('');
    }, [fetchOptions]);

    return (
        <NewMultiselectInput
            id={resourceName}
            name={'relationships[' + resourceName + '][' + resourceType + ']'}
            loading={loading}
            label={label}
            options={options}
            defaultValue={defaultValue}
            required={required}
            onQueryChange={setQuery}
            query={query}
            multiple={false}
        />
    );
}
