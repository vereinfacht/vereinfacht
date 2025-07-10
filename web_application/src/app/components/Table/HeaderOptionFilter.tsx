// refactor the dropdown filter
// implement the component in Mitgliedschaften -> status (memenberships.tsx)
import React, { ReactNode } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import { Button } from '@/app/components/ui/button';
import Checkbox from '@/app/components/Input/Checkbox';
import { ListFilter } from 'lucide-react';

interface Probs {
    headerLabel: ReactNode;
    options: readonly string[];
    value: readonly string[];
    onChange?: (value: readonly string[]) => void;
}

export function HeaderOptionFilter({
    options,
    headerLabel,
    value,
    onChange,
}: Probs) {
    const toggleValue = (option: string, checked: boolean) => {
        const selectedOptions = checked
            ? [...(value ?? []), option]
            : (value ?? []).filter((value) => value !== option);
        onChange?.(selectedOptions);
    };

    return (
        <div className="flex items-center gap-x-4">
            {headerLabel}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <ListFilter className="ml-auto h-4 w-4 text-gray-400" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-y-4 p-2">
                    {options.map((option) => (
                        <DropdownMenuItem
                            key={option}
                            asChild
                            onSelect={(e) => e.preventDefault()}
                        >
                            <Checkbox
                                type="checkbox"
                                id={option}
                                value={option}
                                key={option}
                                label={option}
                                defaultValue={value?.includes(option) ?? false}
                                handleChange={(e) =>
                                    toggleValue(option, e.target.checked)
                                }
                            />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
