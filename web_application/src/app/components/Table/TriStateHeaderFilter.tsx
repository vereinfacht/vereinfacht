'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import { Button } from '@/app/components/ui/button';
import * as RadixSwitch from '@radix-ui/react-switch';
import { ListFilter, RotateCcw } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { ParserBuilder, useQueryState } from 'nuqs';
import { paginationSearchParamParser } from '@/utils/search-params';
import Text from '../Text/Text';

interface Props {
    parser: ParserBuilder<boolean>;
    paramKey: string;
    translationKey: string;
}

export function TriStateHeaderFilter({
    parser,
    paramKey,
    translationKey,
}: Props) {
    const { t } = useTranslation();
    const [filterValue, setFilterValue] = useQueryState(paramKey, parser);
    const [_, setPage] = useQueryState('page', paginationSearchParamParser);

    const hasActiveFilter = filterValue !== null;

    return (
        <div
            className={`flex items-center gap-x-4 ${
                hasActiveFilter ? 'text-slate-800' : ''
            }`}
        >
            {t(`${translationKey}.label`)}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        data-cy={`${paramKey}-button`}
                        className="relative"
                        variant="ghost"
                    >
                        <ListFilter
                            className={`ml-auto h-4 w-4 text-gray-400${hasActiveFilter ? 'scale-125 text-green-800' : ''}`}
                        />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="flex gap-4 p-2">
                    <DropdownMenuItem
                        asChild
                        onSelect={(e) => e.preventDefault()}
                    >
                        <div className="flex w-full items-center justify-between gap-x-4">
                            <Text>{t(`${translationKey}.false`)}</Text>
                            <RadixSwitch.Root
                                checked={filterValue === true}
                                onCheckedChange={(checked) => {
                                    setFilterValue(checked);
                                    setPage(null);
                                }}
                                className="relative h-6 w-11 cursor-pointer rounded-full bg-gray-300 transition-colors data-[state=checked]:bg-blue-600"
                            >
                                <RadixSwitch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5" />
                            </RadixSwitch.Root>
                            <Text>{t(`${translationKey}.true`)}</Text>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            if (hasActiveFilter) {
                                setFilterValue(null);
                                setPage(null);
                            }
                        }}
                        className={`flex cursor-pointer items-center justify-center ${
                            !hasActiveFilter
                                ? 'disabled cursor-not-allowed'
                                : ''
                        }`}
                    >
                        <RotateCcw
                            className={`h-4 w-4 text-gray-600 ${!hasActiveFilter ? 'hover:text-red-600' : ''}`}
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
