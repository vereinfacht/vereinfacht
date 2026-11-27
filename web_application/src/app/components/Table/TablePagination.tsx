'use client';

import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/app/components/ui/pagination';

import { useQueryState } from 'nuqs';
import { paginationSearchParamParser } from '@/utils/search-params';

interface Props {
    totalPages?: number;
}

type EllipsesItemType = {
    type: 'ellipsis';
    pages: number[];
};

type PageItemType = {
    type: 'page';
    index: number;
    disabled?: boolean;
};

type PaginationItemType = EllipsesItemType | PageItemType;

function createPageRange(start: number, end: number): number[] {
    return Array.from(
        { length: Math.max(0, end - start + 1) },
        (_, index) => start + index,
    );
}

export default function TablePagination({ totalPages }: Props) {
    const [currentPage, setCurrentPage] = useQueryState(
        'page',
        paginationSearchParamParser,
    );

    if (totalPages === undefined || totalPages <= 1) {
        return null;
    }

    function changeCurrentPage(
        event: React.MouseEvent<HTMLAnchorElement>,
        page: number,
    ) {
        event.preventDefault();
        setCurrentPage(page);
    }

    function getPaginationItems(): PaginationItemType[] {
        if (totalPages === undefined || totalPages <= 1) {
            return [];
        }

        if (totalPages <= 5) {
            return createPageRange(1, totalPages).map((page) => ({
                type: 'page',
                index: page,
                disabled: page === currentPage,
            }));
        }

        let visiblePages: number[];

        if (currentPage <= 2) {
            visiblePages = [1, 2, 3, totalPages];
        } else if (currentPage >= totalPages - 1) {
            visiblePages = [1, totalPages - 2, totalPages - 1, totalPages];
        } else {
            visiblePages = [
                1,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                totalPages,
            ];
        }

        visiblePages = Array.from(new Set(visiblePages));

        const items: PaginationItemType[] = [];

        visiblePages.forEach((page, index) => {
            const previousPage = visiblePages[index - 1];

            if (previousPage !== undefined && page - previousPage > 1) {
                items.push({
                    type: 'ellipsis',
                    pages: createPageRange(previousPage + 1, page - 1),
                });
            }

            items.push({
                type: 'page',
                index: page,
                disabled: page === currentPage,
            });
        });

        return items;
    }

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={(event) =>
                            changeCurrentPage(event, currentPage - 1)
                        }
                        disabled={currentPage <= 1}
                    />
                </PaginationItem>

                {getPaginationItems().map((item) => {
                    if (item.type === 'ellipsis') {
                        return (
                            <PaginationItem key={`ellipsis-${item.pages[0]}`}>
                                <PaginationEllipsis
                                    pages={item.pages}
                                    onSelectPage={(page) =>
                                        setCurrentPage(page)
                                    }
                                />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={`page-${item.index}`}>
                            <PaginationLink
                                isActive={item.disabled}
                                onClick={(event) =>
                                    changeCurrentPage(event, item.index)
                                }
                                data-cy={`table-pagination-button-${item.index}`}
                            >
                                {item.index}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={(event) =>
                            changeCurrentPage(event, currentPage + 1)
                        }
                        disabled={currentPage >= totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
