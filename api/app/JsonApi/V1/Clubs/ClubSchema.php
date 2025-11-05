<?php

namespace App\JsonApi\V1\Clubs;

use App\Models\Club;
use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\Fields\ID;
use App\JsonApi\V1\Fields\StrSanitized;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\Where;
use LaravelJsonApi\Eloquent\Fields\Boolean;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\Relations\HasOne;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;

class ClubSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Club::class;

    protected int $maxDepth = 3;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('slug'),
            Str::make('title'),
            Str::make('extendedTitle'),
            StrSanitized::make('applyTitle'),
            Str::make('applyUrl')->readonly(),
            Str::make('address'),
            Str::make('zipCode'),
            Str::make('city'),
            Str::make('country'),
            Str::make('preferredLocale'),
            Str::make('email'),
            Str::make('websiteUrl'),
            Str::make('primaryColor'),
            Str::make('logoUrl'),
            Str::make('privacyStatementUrl'),
            Str::make('contributionStatementUrl'),
            Str::make('constitutionUrl'),
            Str::make('membershipStartCycleType'),
            Boolean::make('allowVoluntaryContribution'),
            Boolean::make('hasConsentedMediaPublicationIsRequired'),
            Boolean::make('hasConsentedMediaPublicationDefaultValue'),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            HasMany::make('divisions')->type('divisions'),
            HasMany::make('membershipTypes')->type('membership-types'),
            HasMany::make('paymentPeriods')->type('payment-periods'),
            HasMany::make('financeAccounts')->type('finance-accounts'),
            HasOne::make('skrType')->type('skr-types'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            Where::make('slug'),
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
            'skrType',
        ];
    }
}
