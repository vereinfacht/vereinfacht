<?php

namespace App\JsonApi\V1\FinanceContacts;

use App\Models\FinanceContact;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class FinanceContactSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = FinanceContact::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('last_name'),
            Str::make('first_name'),
            Str::make('company_name'),
            Str::make('gender'),
            Str::make('address'),
            Str::make('zip_code'),
            Str::make('city'),
            Str::make('country'),
            Str::make('phone_number'),
            Str::make('email'),
            Str::make('type'),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
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
