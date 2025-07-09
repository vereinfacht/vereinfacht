import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from '@/app/components/ui/pagination';

import { Button } from '../ui/button';
import { useQueryState } from 'nuqs';
import { paginationSearchParams } from '@/utils/search-params';

interface Props {
    totalPages?: number;
}

export default function TablePagination({ totalPages }: Props) {
    const [currentPage, setCurrentPage] = useQueryState(
        'page',
        paginationSearchParams.page,
    );

    if (!totalPages || totalPages <= 1) {
        return null;
    }

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                {/* previous button */}
                <PaginationItem>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage - 1);
                        }}
                        variant="default"
                        disabled={currentPage <= 1}
                    >
                        Previous
                    </Button>
                </PaginationItem>

                {/* previous pages */}
                {!(currentPage + 1 < totalPages - 1) && (
                    <PaginationItem>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(currentPage - 2);
                            }}
                            variant="outline"
                        >
                            {currentPage - 2}
                        </Button>
                    </PaginationItem>
                )}
                {/* previous pages */}
                {currentPage > 1 && (
                    <PaginationItem>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(currentPage - 1);
                            }}
                            variant="outline"
                        >
                            {currentPage - 1}
                        </Button>
                    </PaginationItem>
                )}
                {/* current page */}
                <PaginationItem>
                    <Button variant="default" disabled>
                        {currentPage}
                    </Button>
                </PaginationItem>

                {/* next two pages */}
                {[currentPage + 1]
                    .filter((page) => page < 8)
                    .map((page) => (
                        <PaginationItem key={page}>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                }}
                                variant="outline"
                            >
                                {page}
                            </Button>
                        </PaginationItem>
                    ))}
                {currentPage === 1 && (
                    <PaginationItem>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(3);
                            }}
                            variant="outline"
                        >
                            3
                        </Button>
                    </PaginationItem>
                )}

                {/* next ellipsis */}
                {typeof totalPages === 'number' &&
                    currentPage + 1 < totalPages - 1 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                {/* last page */}
                {typeof totalPages === 'number' && currentPage < totalPages && (
                    <PaginationItem>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(totalPages);
                            }}
                            variant="outline"
                        >
                            {totalPages}
                        </Button>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage + 1);
                        }}
                        variant="default"
                        disabled={currentPage >= (totalPages ?? 1)}
                    >
                        Next
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
