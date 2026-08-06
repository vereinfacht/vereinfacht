<?php

namespace App\JsonApi\V1\ActivityLogs;

use App\JsonApi\V1\PagePagination;
use App\Models\ActivityLog;
use Illuminate\Support\Str as StringHelper;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\ArrayHash;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\Where;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Schema;

class ActivityLogSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = ActivityLog::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('event')->readOnly(),
            Str::make('subjectType')
                ->serializeUsing(static fn ($value) => $value ? self::resourceTypeFromModelClass($value) : null)
                ->readOnly(),
            Number::make('subjectId')->readOnly(),
            Str::make('causerName')->readOnly(),
            ArrayHash::make('properties')->readOnly(),
            DateTime::make('createdAt')->sortable()->readOnly(),
        ];
    }

    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            Where::make('subjectType', 'subject_type')
                ->deserializeUsing(static fn ($value) => self::modelClassFromResourceType($value)),
            Where::make('subjectId', 'subject_id'),
        ];
    }

    /**
     * Get the resource paginator.
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }

    /**
     * Convert a model class name to its JSON:API resource type,
     * e.g. "App\Models\Club" -> "clubs".
     */
    protected static function resourceTypeFromModelClass(string $modelClass): string
    {
        return StringHelper::of(class_basename($modelClass))->kebab()->plural()->toString();
    }

    /**
     * Convert a JSON:API resource type to its model class name,
     * e.g. "clubs" -> "App\Models\Club".
     */
    protected static function modelClassFromResourceType(string $resourceType): string
    {
        return 'App\\Models\\'.StringHelper::of($resourceType)->singular()->studly()->toString();
    }
}
