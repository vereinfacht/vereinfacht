<?php

return [

    /*
     * If set to false, no activities will be saved to the database.
     */
    'enabled' => env('ACTIVITY_LOGGER_ENABLED', true),

    /*
     * When the clean-command is executed, all recording activities older than
     * the number of days specified here will be deleted.
     */
    'delete_records_older_than_days' => 365,

    /*
     * If no log name is passed to the activity() helper
     * we use this default log name.
     */
    'default_log_name' => 'default',

    /*
     * You can specify an auth driver here that gets user models.
     * If this is null we'll use the current Laravel auth driver.
     */
    'default_auth_driver' => null,

    /*
     * If set to true, the subject returns soft deleted models.
     */
    'subject_returns_soft_deleted_models' => false,

    /*
     * This model will be used to log activity.
     * It should implement the Spatie\Activitylog\Contracts\Activity interface
     * and extend Illuminate\Database\Eloquent\Model.
     */
    'activity_model' => \App\Models\ActivityLog::class,

    /*
     * This is the name of the table that will be created by the migration and
     * used by the Activity model shipped with this package.
     */
    'table_name' => env('ACTIVITY_LOGGER_TABLE_NAME', 'activity_log'),

    /*
     * This is the database connection that will be used by the migration and
     * the Activity model shipped with this package. In case it's not set
     * Laravel's database.default will be used instead.
     */
    'database_connection' => env('ACTIVITY_LOGGER_DB_CONNECTION'),

    /**
     * Maps foreign key columns to their related model's display attribute.
     *
     * When logging activity, foreign key IDs will be replaced with the
     * related model's display value (e.g., "tax_account_chart: SKR03"
     * instead of "tax_account_chart_id: 1").
     *
     * Format: 'foreign_key' => ['relation_method', 'display_attribute']
     *
     * The display_attribute can be:
     * - A column name: 'title', 'name'
     * - An accessor: 'fullName' (defined as Attribute on the related model)
     */
    'relations' => [
        'tax_account_chart_id' => ['taxAccountChart', 'title'],
        'user_id' => ['user', 'name'],
    ],
];
