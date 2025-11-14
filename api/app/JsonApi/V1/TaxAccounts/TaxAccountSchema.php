<?php

namespace App\JsonApi\V1\TaxAccounts;

use App\Models\TaxAccount;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Filters\QueryFilter;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\Has;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;

class TaxAccountSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = TaxAccount::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('accountNumber')->sortable(),
            Str::make('description')->sortable(),
            BelongsTo::make('taxAccountChart')->type('tax-account-charts'),
            BelongsTo::make('club')->type('clubs'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            QueryFilter::make('query', ['account_number', 'description']),
            Has::make($this, 'taxAccountChart'),
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
