<?php

namespace App\JsonApi\V1\FinanceAccounts;

use App\Models\FinanceAccount;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use LaravelJsonApi\Eloquent\Fields\SoftDelete;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Filters\WithTrashed;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\SoftDeletes;

class FinanceAccountSchema extends Schema
{
    use SoftDeletes;

    /**
     * The model the schema corresponds to.
     */
    public static string $model = FinanceAccount::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('accountType'),
            Str::make('title'),
            Str::make('iban'),
            Number::make('initialBalance'),
            Number::make('currentBalance')->extractUsing(
                static fn($model) => $model->getCurrentBalance()
            )->readOnly(),
            DateTime::make('startsAt'),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            SoftDelete::make('deletedAt'),
            BelongsTo::make('club')->type('clubs'),
            HasMany::make('transactions')->type('transactions'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            WithTrashed::make('with-trashed'),
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
