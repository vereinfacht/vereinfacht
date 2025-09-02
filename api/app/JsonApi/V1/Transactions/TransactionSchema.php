<?php

namespace App\JsonApi\V1\Transactions;

use App\Models\Transaction;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Filters\QueryFilter;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Filters\Where;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use App\JsonApi\Filters\WithoutRelationFilter;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\Relations\HasOne;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
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
            Str::make('name'),
            Str::make('description'),
            Number::make('amount')->sortable(),
            DateTime::make('valuedAt')->sortable(),
            DateTime::make('bookedAt')->sortable(),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            HasOne::make('financeAccount'),
            BelongsToMany::make('receipts'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            Where::make('financeAccountId', 'finance_account_id')->using('='),
            QueryFilter::make('query', ['name', 'description', 'amount']),
            WithoutRelationFilter::make('withoutReceipts', 'receipts'),
        ];
    }

    /**
     * Get the resource paginator.
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }
}
