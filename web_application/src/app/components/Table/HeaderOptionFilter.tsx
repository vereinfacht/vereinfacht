import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/DropdownMenu';
import Checkbox from '@/app/components/Input/Checkbox';
import { Button } from '@/app/components/ui/button';
import { ListFilter } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { SingleParserBuilder, useQueryState } from 'nuqs';
import { paginationSearchParamParser } from '@/utils/search-params';
import { Badge } from '../ui/badge';
interface Props {
    parser: SingleParserBuilder<any[]>;
    paramKey: string;
    options: readonly string[];
    translationKey: string;
}

export function HeaderOptionFilter({
    options,
    paramKey,
    parser,
    translationKey,
}: Props) {
    const { t } = useTranslation();
    const [filterQueryParam, setFilterQueryParam] = useQueryState(
        paramKey,
        parser,
    );
    const [_, setPage] = useQueryState('page', paginationSearchParamParser);

    function handleToggleOption(selectedOption: string, checked: boolean) {
        const currentOptions = filterQueryParam ?? [];
        const updated = checked
            ? [...currentOptions, selectedOption]
            : currentOptions.filter((option) => option !== selectedOption);

        setFilterQueryParam(updated);
        setPage(null);
    }

    return (
        <div
            className={`flex items-center gap-x-4 ${filterQueryParam?.length ? 'text-slate-800' : ''}`}
        >
            {' '}
            {t(`${translationKey}.label`)}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        data-cy={`${paramKey}-button`}
                        className="relative"
                        variant="ghost"
                    >
                        <ListFilter
                            className={[
                                'ml-auto h-4 w-4 text-gray-400',
                                filterQueryParam?.length
                                    ? 'text-slate-800'
                                    : '',
                            ].join(' ')}
                        />
                        {filterQueryParam?.length ? (
                            <Badge
                                className="absolute top-0 right-0 flex h-5 w-5 flex-col items-center justify-center rounded-full px-1 text-[10px] text-white tabular-nums"
                                variant="primary"
                            >
                                {filterQueryParam.length}
                            </Badge>
                        ) : null}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-y-4 p-4">
                    {options.map((option) => (
                        <DropdownMenuItem
                            key={option}
                            asChild
                            onSelect={(e) => e.preventDefault()}
                        >
                            <Checkbox
                                type="checkbox"
                                id={`option-${option}`}
                                value={option}
                                label={t(`${translationKey}.${option}`)}
                                defaultValue={
                                    filterQueryParam?.includes(option) ?? false
                                }
                                handleChange={(e) =>
                                    handleToggleOption(option, e.target.checked)
                                }
                            />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
