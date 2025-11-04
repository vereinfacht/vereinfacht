<?php

namespace App\JsonApi\V1\TaxAccounts;

use App\Models\TaxAccount;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Filters\QueryFilter;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;


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
            Str::make('name'),
            Str::make('referenceNumber'),
            Str::make('description'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            QueryFilter::make('query', ['reference_number', 'name']),
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
