'use client';

import { Check } from 'lucide-react';

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
import IconChevronDown from '/public/svg/chevron_down.svg';
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
                        variant="tertiaryGray"
                        role="combobox"
                        className={cn(
                            'border-borderDefault bg-surfaceSolidInput text-textPrimary focus:border-borderFocus focus:bg-btnBgTertiaryHover mt-1 h-12 w-full justify-between rounded-xl border px-3 py-2 text-base font-normal outline-hidden transition-all',
                            selected.length < 1 && 'text-textSecondary',
                        )}
                        rightIcon={<IconChevronDown />}
                    >
                        {selected.length > 0
                            ? multiple
                                ? t('general:selected_count', {
                                      count: selected.length,
                                  })
                                : selected[0].label
                            : t('general:select')}
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
                            <div className="absolute top-2 right-2 h-6 w-6 animate-spin">
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
                                        disabled={option.disabled}
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
