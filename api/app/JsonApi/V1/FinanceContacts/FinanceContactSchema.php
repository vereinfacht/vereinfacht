<?php

namespace App\JsonApi\V1\FinanceContacts;

use App\Models\FinanceContact;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Sorting\FullNameSort;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Filters\WhereIn;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;

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
            Str::make('lastName'),
            Str::make('firstName'),
            Str::make('fullName'),
            Str::make('companyName')->sortable(),
            Str::make('gender'),
            Str::make('address'),
            Str::make('zipCode'),
            Str::make('city')->sortable(),
            Str::make('country'),
            Str::make('phoneNumber'),
            Str::make('email'),
            Str::make('type'),
            DateTime::make('createdAt')->readOnly(),
            DateTime::make('updatedAt')->readOnly(),
            BelongsTo::make('club')->type('clubs'),
            HasMany::make('receipts')->type('receipts'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            WhereIn::make('type')->delimiter(','),
        ];
    }

    /**
     * Get the resource paginator.
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }

    public function sortables(): iterable
    {
        return [
            FullNameSort::make('fullName'),
        ];
    }

    public function includePaths(): array
    {
        return [
            'receipts',
        ];
    }
}
