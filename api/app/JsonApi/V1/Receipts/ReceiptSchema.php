<?php

namespace App\JsonApi\V1\Receipts;

use App\JsonApi\Sorting\ReceiptAmountSort;
use App\JsonApi\V1\PagePagination;
use App\Models\Receipt;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Filters\QueryFilter;
use App\JsonApi\Filters\StatusFilter;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use App\JsonApi\Filters\DateRangeFilter;
use LaravelJsonApi\Eloquent\Filters\Has;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Filters\WhereIn;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;

class ReceiptSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Receipt::class;

    protected $defaultSort = '-bookingDate';

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('referenceNumber'),
            Str::make('receiptType'),
            DateTime::make('bookingDate')->sortable(),
            Str::make('status')->readOnly(),
            Str::make('amount'),
            DateTime::make('createdAt')->readOnly(),
            DateTime::make('updatedAt')->readOnly(),
            BelongsTo::make('club')->type('clubs'),
            BelongsTo::make('financeContact')->type('finance-contacts'),
            BelongsTo::make('taxAccount')->type('tax-accounts'),
            HasMany::make('transactions')->type('transactions'),
            HasMany::make('media')->type('media')->readOnly(),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            Has::make($this, 'media'),
            StatusFilter::make(
                'status',
                'transactions',
                'transactions',
                'receipt_id',
                'id',
                'transactions',
                'amount',
                'amount'
            ),
            WhereIn::make('receiptType')->delimiter(','),
            QueryFilter::make('query', ['reference_number', 'amount'], ['amount']),
            DateRangeFilter::make('bookingDate', 'booking_date'),
        ];
    }

    /**
     * Get the resource paginator.
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }

    public function sortables(): iterable
    {
        return [
            ReceiptAmountSort::make('amount'),
        ];
    }

    public function includePaths(): array
    {
        return [
            'transactions',
            'financeContact',
            'media',
            'taxAccount',
            'taxAccount.taxAccountChart',
        ];
    }
}
