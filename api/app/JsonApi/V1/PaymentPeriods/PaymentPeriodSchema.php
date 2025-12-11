<?php

namespace App\JsonApi\V1\PaymentPeriods;

use App\Models\PaymentPeriod;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use App\JsonApi\V1\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class PaymentPeriodSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = PaymentPeriod::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('title')->readOnly(),
            Str::make('rrule'),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
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
