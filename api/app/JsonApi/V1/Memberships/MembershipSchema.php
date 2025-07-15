<?php

namespace App\JsonApi\V1\Memberships;

use App\Models\Membership;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Filters\WhereIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class MembershipSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Membership::class;

    protected $defaultSort = '-createdAt';

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('bankIban'),
            Str::make('bankAccountHolder'),
            Str::make('notes'),
            Str::make('status'),
            Str::make('monthlyFee')->extractUsing(
                static fn($model) => $model->getMonthlyFee()
            )->readOnly(),
            Number::make('voluntaryContribution'),
            DateTime::make('startedAt')->sortable(),
            DateTime::make('endedAt')->sortable(),
            DateTime::make('createdAt')->sortable(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            BelongsTo::make('club')->type('clubs'),
            BelongsTo::make('membershipType')->type('membership-types'),
            BelongsTo::make('owner')->type('members'),
            BelongsTo::make('paymentPeriod')->type('payment-periods'),
            HasMany::make('members')->type('members'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            WhereIn::make('status')->delimiter(','),
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
