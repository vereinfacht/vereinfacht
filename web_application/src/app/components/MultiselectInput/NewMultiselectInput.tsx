'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/app/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/app/components/ui/popover';
import { cn } from '@/utils/shadcn';
import { Button } from '@/app/components/ui/button';
import InputLabel from '../Input/InputLabel';
import { Option } from '../Input/SelectInput';
import { filterOptionsByQuery, sortOptions } from './MultiselectInput';
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import IconLoading from '/public/svg/loading.svg';
import SelectedOptions from './SelectedOptions';

interface Props {
    id: string;
    name?: string;
    label: string | React.ReactNode;
    query: string;
    loading?: boolean;
    required?: boolean;
    multiple?: boolean;
    options: Option[];
    defaultValue?: Option[];
    onChange?: (selected: Option[]) => void;
    onQueryChange?: (query: string) => void;
}

export function NewMultiselectInput({
    id,
    name,
    label,
    query,
    loading = false,
    multiple = false,
    required = false,
    options: unsortedOptions,
    onQueryChange,
    onChange,
    defaultValue,
}: Props) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<Option[]>(defaultValue || []);
    const shouldFilter = !onQueryChange;
    const options = shouldFilter
        ? sortOptions(unsortedOptions)
        : unsortedOptions;
    const filteredOptions = shouldFilter
        ? options
        : filterOptionsByQuery(options, query);

    const handleRemove = (removedOption: Option) => {
        setSelected((prev) => {
            const newSelected = prev.filter(
                (option) => option.value !== removedOption.value,
            );

            if (onChange) {
                onChange(newSelected);
            }

            return newSelected;
        });
    };

    function handleSelectionChange(value: string) {
        setSelected((prev) => {
            let newSelected: Option[] = [];
            const option = options.find(
                (option) => option.value.toString() === value,
            );
            if (!option) {
                return prev;
            }

            const isSelected = prev.find(
                (selectedOption) => selectedOption.value === option.value,
            );

            if (multiple) {
                if (isSelected) {
                    newSelected = prev.filter(
                        (selectedOption) =>
                            selectedOption.value !== option.value,
                    );
                } else {
                    newSelected = [...prev, option];
                }
            } else {
                newSelected = isSelected ? [] : [option];
            }

            if (onChange) {
                onChange(newSelected);
            }

            return newSelected;
        });
    }

    return (
        <div className="w-full">
            <input
                type="hidden"
                name={name}
                value={
                    multiple
                        ? '[' + selected.map((s) => s.value).join(',') + ']'
                        : (selected[0]?.value ?? '')
                }
            />
            {label &&
                (typeof label === 'string' ? (
                    <InputLabel
                        forInput={id}
                        value={label}
                        required={required}
                    />
                ) : (
                    label
                ))}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            'mt-1 w-full justify-between',
                            selected.length < 1 && 'text-muted-foreground',
                        )}
                    >
                        {selected.length > 0
                            ? multiple
                                ? t('general:selected_count', {
                                      count: selected.length,
                                  })
                                : selected[0].label
                            : t('general:select')}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="PopoverContent p-0" align="start">
                    <Command shouldFilter={shouldFilter}>
                        <CommandInput
                            name={name}
                            placeholder={t('general:search')}
                            className="h-9"
                            onValueChange={(text: string) =>
                                onQueryChange?.(text)
                            }
                        />
                        {loading && (
                            <div className="absolute right-2 top-2 h-6 w-6 animate-spin">
                                <IconLoading />
                            </div>
                        )}
                        <CommandList>
                            <CommandEmpty>
                                {t('general:nothing_found')}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        value={option.value.toString()}
                                        key={option.value}
                                        onSelect={handleSelectionChange}
                                    >
                                        {option.label}
                                        <Check
                                            className={cn(
                                                'ml-auto',
                                                selected.find(
                                                    (selectedOption) =>
                                                        selectedOption.value ===
                                                        option.value,
                                                )
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {selected.length > 0 && multiple && (
                <SelectedOptions
                    options={selected}
                    handleRemove={handleRemove}
                />
            )}
        </div>
    );
}
