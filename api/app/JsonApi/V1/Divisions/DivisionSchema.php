<?php

namespace App\JsonApi\V1\Divisions;

use App\Models\Division;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\ArrayHash;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsToMany;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use App\JsonApi\V1\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class DivisionSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Division::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('title')->readOnly(),
            ArrayHash::make('titleTranslations', 'title')->extractUsing(
                static fn($model, $column) => $model->getTranslations($column)
            ),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            BelongsTo::make('club')->type('clubs'),
            BelongsToMany::make('members')->type('members'),
            BelongsToMany::make('membershipTypes')->type('membership-types'),
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
