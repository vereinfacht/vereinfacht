'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { ParserBuilder, useQueryState } from 'nuqs';
import { Button } from '../ui/button';

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
                        <ArrowDown className="stroke-iconSecondary h-4 w-4" />
                    ) : matchedSort === columnId ? (
                        <ArrowUp className="stroke-iconSecondary h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="stroke-iconSecondary h-4 w-4" />
                    )
                }
            />
        </span>
    );
}
