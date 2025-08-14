<?php

namespace App\Models\Behaviors;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Traits\HasRoles as PackageHasRoles;

trait HasRoles
{
    use PackageHasRoles;

    public function roles(): BelongsToMany
    {
        // CUSTOM: adding pivot column club_id to roles relation
        $relation = $this->morphToMany(
            config('permission.models.role'),
            'model',
            config('permission.table_names.model_has_roles'),
            config('permission.column_names.model_morph_key'),
            app(PermissionRegistrar::class)->pivotRole
        )->withPivot(app(PermissionRegistrar::class)->teamsKey);
        // ENDCUSTOM

        $teamField = config('permission.table_names.roles') . '.' . app(PermissionRegistrar::class)->teamsKey;

        return $relation->wherePivot(app(PermissionRegistrar::class)->teamsKey, getPermissionsTeamId())
            ->where(fn($q) => $q->whereNull($teamField)->orWhere($teamField, getPermissionsTeamId()));
    }
}
