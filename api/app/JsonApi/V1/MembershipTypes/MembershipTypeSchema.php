<?php

namespace App\JsonApi\V1\MembershipTypes;

use App\JsonApi\V1\Fields\StrSanitized;
use App\Models\MembershipType;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\ArrayHash;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsToMany;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use App\JsonApi\V1\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class MembershipTypeSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = MembershipType::class;

    protected $defaultSort = 'sortOrder';

    protected int $maxDepth = 2;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('title'),
            ArrayHash::make('titleTranslations', 'title')->extractUsing(
                static fn($model, $column) => $model->getTranslations($column)
            ),
            StrSanitized::make('description'),
            ArrayHash::make('descriptionTranslations', 'description')->extractUsing(
                static fn($model, $column) => $model->getTranslations($column)
            ),
            Number::make('admissionFee'),
            Number::make('monthlyFee'),
            Number::make('minimumNumberOfMonths'),
            Number::make('minimumNumberOfMembers'),
            Number::make('maximumNumberOfMembers'),
            Number::make('sortOrder')->sortable(),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            BelongsToMany::make('divisions')->type('divisions'),
            BelongsToMany::make('divisionMembershipTypes')
                ->type('division-membership-types'),
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
