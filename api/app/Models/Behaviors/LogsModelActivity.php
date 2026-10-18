<?php

namespace App\Models\Behaviors;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Reusable action logging behavior.
 *
 * Add this trait to any model to log create/update/delete changes
 * to the activity_log table (see App\Models\ActivityLog). Only dirty
 * fillable attributes are logged, together with their old values.
 *
 * A model may override getActivitylogOptions() for custom behavior,
 * e.g. to exclude sensitive attributes:
 *
 *     public function getActivitylogOptions(): LogOptions
 *     {
 *         return $this->defaultActivitylogOptions()->dontLogIfAttributesChangedOnly(['password']);
 *     }
 *
 * Foreign key mappings are defined centrally in config/activitylog.php.
 * This allows logging "tax_account_chart: SKR03" instead of "tax_account_chart_id: 1".
 */
trait LogsModelActivity
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return $this->defaultActivitylogOptions();
    }

    protected function defaultActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function tapActivity(Activity $activity, string $eventName): void
    {
        $activity->properties = collect(
            $this->replaceForeignKeysWithDisplayValues($activity->properties->toArray())
        );
    }

    /**
     * Replace foreign key IDs with human-readable display values.
     *
     * Transforms ['tax_account_chart_id' => 1] into ['tax_account_chart' => 'SKR03'].
     */
    protected function replaceForeignKeysWithDisplayValues(array $properties): array
    {
        $relationMappings = config('activitylog.relations', []);

        foreach (['attributes', 'old'] as $group) {
            if (! isset($properties[$group])) {
                continue;
            }

            foreach ($relationMappings as $foreignKey => [$relationMethod, $displayAttribute]) {
                if (! array_key_exists($foreignKey, $properties[$group])) {
                    continue;
                }

                if (! method_exists($this, $relationMethod)) {
                    continue;
                }

                $displayValue = $this->resolveRelatedDisplayValue(
                    $properties[$group][$foreignKey],
                    $relationMethod,
                    $displayAttribute
                );

                // Replace 'tax_account_chart_id' with 'tax_account_chart'
                $displayKey = preg_replace('/_id$/', '', $foreignKey);
                unset($properties[$group][$foreignKey]);
                $properties[$group][$displayKey] = $displayValue;
            }
        }

        return $properties;
    }

    /**
     * Resolve the display value from a related model.
     *
     * Supports single attributes ('title'), accessors ('fullName')
     */
    protected function resolveRelatedDisplayValue(mixed $id, string $relationMethod, string $displayAttribute): ?string
    {
        if ($id === null) {
            return null;
        }

        $relatedModel = $this->$relationMethod()->getRelated()->find($id);

        if (! $relatedModel) {
            return null;
        }

        return $relatedModel->$displayAttribute;
    }
}
