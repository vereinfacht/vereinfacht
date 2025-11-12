<?php

namespace App\JsonApi\V1\Transactions;

use App\Models\Transaction;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Filters\QueryFilter;
use App\JsonApi\Filters\StatusFilter;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use App\JsonApi\Filters\WithoutRelationFilter;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsToMany;

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
            BelongsToMany::make('receipts'),
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
            WithoutRelationFilter::make('withoutReceipts', 'receipts'),
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
            'receipts',
            'statement',
            'statement.financeAccount',
        ];
    }
}
