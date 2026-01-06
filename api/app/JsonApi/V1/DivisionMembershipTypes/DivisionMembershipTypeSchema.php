<?php

namespace App\JsonApi\V1\DivisionMembershipTypes;

use App\Models\DivisionMembershipType;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use App\JsonApi\V1\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class DivisionMembershipTypeSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = DivisionMembershipType::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Number::make('monthlyFee'),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            BelongsTo::make('division')->type('divisions'),
            BelongsTo::make('membershipType')->type('membership-types'),
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
