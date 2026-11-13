'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { sortByKey } from '@/utils/objects';
import { Label } from '@/app/components/ui/label';
import HelpText from '../HelpText';
import { Option } from '../Input/SelectInput';
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from '../ui/combobox';

interface Props {
    name: string;
    options: Option[];
    label?: ReactNode;
    help?: string;
    defaultValue?: Option[];
    onChange?: (selected: Option[]) => void;
    required?: boolean;
}

export function sortOptions(options: Option[]) {
    return sortByKey<Option>(options, 'label');
}

export default function MultiselectInput({
    name,
    options,
    label,
    help,
    defaultValue,
    onChange,
    required = false,
}: Props) {
    const [selected, setSelected] = useState<Option[]>(defaultValue ?? []);
    const onChangeRef = useRef(onChange);
    const anchor = useComboboxAnchor();

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        onChangeRef.current?.(selected);
    }, [selected]);

    return (
        <div className="flex flex-col items-start">
            {typeof label === 'string' ? (
                <Label htmlFor={name}>
                    {label}
                    {required && ' *'}
                </Label>
            ) : (
                label
            )}

            <Combobox
                items={sortOptions(options)}
                multiple
                value={selected}
                onValueChange={setSelected}
                isItemEqualToValue={(a, b) => a.value === b.value}
                itemToStringLabel={(option) =>
                    typeof option.label === 'string'
                        ? option.label
                        : String(option.value)
                }
                onOpenChange={(open, details) => {
                    if (!open && details.reason === 'item-press') {
                        details.cancel();
                    }
                }}
            >
                <ComboboxChips
                    ref={anchor}
                    className="mt-1 w-full"
                    aria-label="Selected options"
                >
                    <ComboboxValue>
                        {selected.map((option) => (
                            <ComboboxChip key={option.value}>
                                {option.label}
                            </ComboboxChip>
                        ))}
                    </ComboboxValue>

                    <ComboboxChipsInput id={name} aria-required={required} />
                </ComboboxChips>

                <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No options found.</ComboboxEmpty>
                    <ComboboxList>
                        {(option: Option) => (
                            <ComboboxItem
                                key={option.value}
                                value={option}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>

            {help && <HelpText text={help} className="mt-1" />}

            {selected.map((option, index) => (
                <input
                    key={option.value}
                    type="hidden"
                    name={`${name}[${index}][value]`}
                    value={String(option.value)}
                />
            ))}

            <input
                type="text"
                name={name}
                value={
                    selected.length
                        ? JSON.stringify(selected.map((option) => option.value))
                        : ''
                }
                required={required}
                className="pointer-events-none absolute opacity-0"
                tabIndex={-1}
                readOnly
            />
        </div>
    );
}
