import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from '@/app/components/ui/pagination';

import { Button } from '../ui/button';
import { useQueryState } from 'nuqs';
import { paginationSearchParamParser } from '@/utils/search-params';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    totalPages?: number;
}

type EllipsesItemType = {
    type: 'ellipsis';
};

type PageItemType = {
    type: 'page';
    index: number;
    disabled?: boolean;
};

type PaginationItemType = EllipsesItemType | PageItemType;

export default function TablePagination({ totalPages }: Props) {
    const { t } = useTranslation('general');
    const [currentPage, setCurrentPage] = useQueryState(
        'page',
        paginationSearchParamParser,
    );

    if (totalPages === undefined || totalPages <= 1) {
        return null;
    }

    function changeCurrentPage(
        event: React.MouseEvent<HTMLButtonElement>,
        page: number,
    ) {
        event.preventDefault();
        setCurrentPage(page);
    }

    function getPaginationItems() {
        const items: PaginationItemType[] = [];

        if (totalPages === undefined || totalPages <= 1) {
            return items;
        }

        // If total pages equal or less than 5, just show all pages
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                items.push({
                    type: 'page',
                    index: i,
                    disabled: i === currentPage,
                });
            }
            return items;
        }

        // start ellipsis and first page
        if (currentPage > totalPages - 2) {
            items.push({
                type: 'page',
                index: 1,
            });

            items.push({
                type: 'ellipsis',
            });
        }

        // previous page
        if (currentPage > 1) {
            if (
                (currentPage === totalPages ||
                    currentPage === totalPages - 2) &&
                currentPage - 2 >= 1
            ) {
                items.push({
                    type: 'page',
                    index: currentPage - 2,
                });
            }

            if (currentPage - 1 >= 1) {
                items.push({
                    type: 'page',
                    index: currentPage - 1,
                });
            }
        }

        // current page
        items.push({
            type: 'page',
            index: currentPage,
            disabled: true,
        });

        // next page
        if (currentPage < totalPages) {
            items.push({
                type: 'page',
                index: currentPage + 1,
            });

            if (currentPage === 1) {
                items.push({
                    type: 'page',
                    index: currentPage + 2,
                });
            }

            if (currentPage === totalPages - 2) {
                items.push({
                    type: 'page',
                    index: totalPages,
                });
            }
        }

        // end ellipsis and last page
        if (currentPage < totalPages - 2) {
            items.push({
                type: 'ellipsis',
            });

            items.push({
                type: 'page',
                index: totalPages,
            });
        }

        return items;
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button
                        onClick={(event) =>
                            changeCurrentPage(event, currentPage - 1)
                        }
                        variant="default"
                        disabled={currentPage <= 1}
                        data-cy="table-pagination-previous-button"
                    >
                        {t('pagination.previous')}
                    </Button>
                </PaginationItem>

                {getPaginationItems().map((item, index) => {
                    if (item.type === 'ellipsis') {
                        return (
                            <PaginationEllipsis key={index} className="w-10" />
                        );
                    }

                    return (
                        <PaginationItem key={index}>
                            <Button
                                className="w-10"
                                onClick={(event) =>
                                    changeCurrentPage(event, item.index)
                                }
                                variant={item.disabled ? 'default' : 'outline'}
                                disabled={item.disabled ?? false}
                                data-cy={`table-pagination-button-${item.index}`}
                            >
                                {item.index}
                            </Button>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <Button
                        onClick={(event) =>
                            changeCurrentPage(event, currentPage + 1)
                        }
                        variant="default"
                        disabled={currentPage >= totalPages}
                        data-cy="table-pagination-next-button"
                    >
                        {t('pagination.next')}
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
