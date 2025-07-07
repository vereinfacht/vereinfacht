<?php

namespace App\JsonApi\V1\FinanceAccountTypes;

use App\Models\FinanceAccountType;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\ArrayHash;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class FinanceAccountTypeSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = FinanceAccountType::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('title'),
            ArrayHash::make('titleTranslations', 'title')->extractUsing(
                static fn ($model, $column) => $model->getTranslations($column)
            ),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
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
