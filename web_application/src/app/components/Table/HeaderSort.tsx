'use client';

import { ParserBuilder, useQueryState } from 'nuqs';
import { Button } from '../ui/button';
import IconSorting from '/public/svg/sorting.svg';
import IconSortingDescending from '/public/svg/sorting_descending.svg';
import IconSortingAscending from '/public/svg/sorting_ascending.svg';

interface Props {
    parser: ParserBuilder<any[]>;
    columnTitle: string;
    columnId: string;
}

export default function HeaderSort({ parser, columnTitle, columnId }: Props) {
    const [sort, setSort] = useQueryState('sort', parser);
    const matchedSort = sort?.find((s) => s.includes(columnId));

    return (
        <span
            className={`flex items-center gap-x-4 ${matchedSort ? 'text-slate-800' : ''}`}
        >
            {columnTitle}
            <Button
                className="cursor-pointer"
                variant="tertiaryGray"
                size={'icon'}
                data-cy={`sort-${columnId}`}
                onClick={() =>
                    setSort((previous) => {
                        const currentSort = previous?.[0];

                        if (!currentSort) {
                            return [`-${columnId}`];
                        }

                        if (currentSort === `-${columnId}`) {
                            return [columnId];
                        }

                        return null;
                    })
                }
                rightIcon={
                    matchedSort === `-${columnId}` ? (
                        <IconSortingDescending />
                    ) : matchedSort === columnId ? (
                        <IconSortingAscending />
                    ) : (
                        <IconSorting />
                    )
                }
            />
        </span>
    );
}
