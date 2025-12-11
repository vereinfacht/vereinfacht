<?php

namespace App\JsonApi\V1\Statements;

use App\Models\Statement;
use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Filters\Where;
use App\JsonApi\Filters\StatementTypeFilter;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use App\JsonApi\V1\PagePagination;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;

class StatementSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Statement::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('identifier'),
            Str::make('title'),
            DateTime::make('date')->sortable(),
            Str::make('status'),
            Str::make('statementType')->sortable()->readOnly(),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            Number::make('amount')->extractUsing(
                static fn($model) => $model->getAmount()
            )->readOnly(),
            BelongsTo::make('financeAccount')->type('finance-accounts'),
            BelongsTo::make('club')->type('clubs'),
            HasMany::make('transactions')->type('transactions'),

            Str::make('title')->extractUsing(
                static fn($model) => $model->transactions()->first()?->title
            )->readOnly(),
            Str::make('description')->extractUsing(
                static fn($model) => $model->transactions()->first()?->description
            )->readOnly(),
            Number::make('transactionAmount')->extractUsing(
                static fn($model) => $model->transactions()->first()?->amount
            )->readOnly(),
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
            StatementTypeFilter::make('statementType'),
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
            'transactions',
            'transactions.receipts',
            'financeAccount',
        ];
    }
}
