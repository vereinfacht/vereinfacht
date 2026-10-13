'use client';

import { useMemo, useState } from 'react';
import { Option } from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import { NewMultiselectInput } from '@/app/components/MultiselectInput/NewMultiselectInput';
import IconTrash from '/public/svg/bin.svg';

interface Props {
    resourceName: string;
    label?: React.ReactNode;
    options: Option[];
    loading: boolean;
    selectedDivision: Option | null;
    onChange: (division: Option | null) => void;
    onRemove: () => void;
}

export function DivisionField({
    resourceName,
    label,
    options,
    loading,
    selectedDivision,
    onChange,
    onRemove,
}: Props) {
    const [query, setQuery] = useState('');

    const filteredOptions = useMemo(() => {
        const searchTerm = query.trim().toLowerCase();

        if (!searchTerm) {
            return options;
        }

        return options.filter((option) =>
            String(option.label).toLowerCase().includes(searchTerm),
        );
    }, [options, query]);

    return (
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-4">
            <NewMultiselectInput
                id={resourceName}
                name={`relationships[${resourceName}][divisions]`}
                label={label}
                loading={loading}
                options={filteredOptions}
                defaultValue={selectedDivision ? [selectedDivision] : []}
                query={query}
                onQueryChange={setQuery}
                multiple={false}
                onChange={(selected) => onChange(selected[0] ?? null)}
            />

            <TextInput
                id={`admission_${resourceName}`}
                name={`admission_${resourceName}`}
                type="date"
                label="Eintritt am"
            />

            <button
                type="button"
                onClick={onRemove}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            >
                <IconTrash className="text-textError" />
            </button>
        </div>
    );
}
