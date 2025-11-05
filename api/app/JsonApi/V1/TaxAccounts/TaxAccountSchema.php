<?php

namespace App\JsonApi\V1\TaxAccounts;

use App\Models\TaxAccount;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Filters\QueryFilter;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
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
            Str::make('accountNumber'),
            Str::make('description'),
            BelongsTo::make('taxAccountChart')->type('tax-account-charts'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            QueryFilter::make('query', ['account_number', 'description']),
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
