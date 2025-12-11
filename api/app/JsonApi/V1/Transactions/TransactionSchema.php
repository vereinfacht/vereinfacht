<?php

namespace App\JsonApi\V1\Transactions;

use App\Models\Transaction;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Filters\QueryFilter;
use App\JsonApi\Filters\StatusFilter;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\Has;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use App\JsonApi\V1\PagePagination;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;

class TransactionSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Transaction::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('title'),
            Str::make('description'),
            Number::make('gvc')->sortable(),
            Str::make('bankIban'),
            Str::make('bankAccountHolder'),
            Str::make('currency'),
            Str::make('amount')->sortable(),
            DateTime::make('valuedAt')->sortable(),
            DateTime::make('bookedAt')->sortable(),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            Str::make('status')->readOnly(),
            BelongsTo::make('receipt')->type('receipts'),
            BelongsTo::make('statement')->type('statements'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            QueryFilter::make('query', ['title', 'description', 'amount', 'bank_account_holder']),
            StatusFilter::make(
                'status',
                'receipts',
                'receipt_transaction',
                'transaction_id',
                'receipt_id',
                'receipts',
                'amount',
                'amount'
            ),
            Has::make($this, 'receipt'),
        ];
    }

    /**
     * Get the resource paginator.
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }

    public function includePaths(): array
    {
        return [
            'receipt',
            'statement',
            'statement.financeAccount',
        ];
    }
}
