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
        <span className="flex items-center gap-x-4">
            {columnTitle}
            <Button
                variant="ghost"
                onClick={() =>
                    setSort((prev) => {
                        const newSorting = `-${columnId}`;

                        if (prev === null) {
                            return [newSorting];
                        }

                        return [prev[0] !== newSorting ? newSorting : columnId];
                    })
                }
            >
                {matchedSort === `-${columnId}` ? (
                    <ArrowDown className="h-4 w-4 stroke-slate-900" />
                ) : matchedSort === columnId ? (
                    <ArrowUp className="h-4 w-4 stroke-slate-900" />
                ) : (
                    <ArrowUpDown className="h-4 w-4 stroke-slate-500" />
                )}
            </Button>
        </span>
    );
}
