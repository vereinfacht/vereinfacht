<?php

namespace App\JsonApi\V1\Receipts;

use App\JsonApi\Fields\HasManyMedia;
use App\Models\Receipt;
use App\Enums\ReceiptStatusEnum;
use App\Enums\ReceiptHasMediaEnum;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use LaravelJsonApi\Eloquent\Fields\Relations\MorphTo;
use LaravelJsonApi\Eloquent\Fields\Relations\MorphToMany;
use LaravelJsonApi\Eloquent\Schema;
use App\JsonApi\Filters\StatusFilter;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Filters\WhereIn;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsToMany;

class ReceiptSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Receipt::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('referenceNumber'),
            Str::make('receiptType'),
            DateTime::make('documentDate')->sortable(),
            Str::make('status')->readOnly(),
            Str::make('amount')->sortable(),
            DateTime::make('createdAt')->readOnly(),
            DateTime::make('updatedAt')->readOnly(),
            BelongsTo::make('club')->type('clubs'),
            BelongsTo::make('financeContact')->type('finance-contacts'),
            BelongsToMany::make('transactions'),
            HasMany::make('media')->type('media'),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            StatusFilter::make(
                'hasMedia',
                null,
                'media',
                [
                    'true' => 'has',
                    'false' => 'doesnt_have',
                ]
            ),
            StatusFilter::make(
                'status',
                null,
                'transactions',
                [
                    ReceiptStatusEnum::COMPLETED->value => 'has',
                    ReceiptStatusEnum::INCOMPLETED->value => 'doesnt_have',
                ]
            ),
            WhereIn::make('receiptType')->delimiter(','),
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
            'transactions',
            'financeContact',
            'media',
        ];
    }
}
