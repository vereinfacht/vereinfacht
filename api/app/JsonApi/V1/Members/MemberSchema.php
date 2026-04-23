<?php

namespace App\JsonApi\V1\Members;

use App\JsonApi\Filters\MemberMembershipFilter;
use App\JsonApi\Sorting\FullNameSort;
use App\JsonApi\V1\PagePagination;
use App\Models\Member;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\Boolean;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsToMany;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Filters\WhereIn;
use LaravelJsonApi\Eloquent\Schema;

class MemberSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Member::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('firstName'),
            Str::make('lastName'),
            Str::make('fullName')->readOnly(),
            Str::make('gender'),
            Str::make('address'),
            Str::make('zipCode'),
            Str::make('city'),
            Str::make('country'),
            Str::make('preferredLocale'),
            Str::make('birthday'),
            Str::make('phoneNumber'),
            Str::make('email'),
            Str::make('status'),
            Str::make('membershipTypeId')->readOnly(),
            Boolean::make('hasConsentedMediaPublication', 'consented_media_publication_at')->fillUsing(
                static function ($model, $column, $value) {
                    $model->fill([
                        $column => $value ? now() : null,
                    ]);
                }
            )->serializeUsing(
                static function ($value) {
                    return $value?->isPast();
                }
            ),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            BelongsTo::make('club')->type('clubs'),
            BelongsTo::make('membership')->type('memberships'),
            BelongsToMany::make('divisions')->type('divisions'),
            HasMany::make('media')->type('media')->readOnly(),
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
            MemberMembershipFilter::make('membershipId'),
        ];
    }

    public function sortables(): iterable
    {
        return [
            FullNameSort::make('fullName'),
        ];
    }

    /**
     * Get the resource paginator.
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }

    public function includePaths(): array
    {
        return [
            'membership',
            'membership.owner',
            'membership.membershipType',
            'divisions',
            'media',
            'club',
        ];
    }
}
