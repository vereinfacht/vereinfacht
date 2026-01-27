<?php

namespace App\Models\Behaviors;

use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Traits\HasRoles as PackageHasRoles;

trait HasRoles
{
    use PackageHasRoles;

    public function roles(): BelongsToMany
    {
        $permissionRegistrar = app(PermissionRegistrar::class);

        $relation = $this->morphToMany(
            config('permission.models.role'),
            'model',
            config('permission.table_names.model_has_roles'),
            config('permission.column_names.model_morph_key'),
            $permissionRegistrar->pivotRole
        )->withPivot($permissionRegistrar->teamsKey);

        // If Spatie teams/multi-tenancy is disabled → return default relation
        if (! $permissionRegistrar->teams) {
            return $relation;
        }

        $user = $this;

        // Check if user has 'super admin' role globally
        $roleModel     = config('permission.models.role');
        $roleInstance  = app($roleModel);
        $rolesTable    = $roleInstance->getTable();
        $pivotTable    = config('permission.table_names.model_has_roles');
        $modelMorphKey = config('permission.column_names.model_morph_key');
        $roleIdColumn  = $permissionRegistrar->pivotRole;

        $hasSuperAdmin = DB::table($pivotTable)
            ->join($rolesTable, $rolesTable . '.id', '=', $pivotTable . '.' . $roleIdColumn)
            ->where($pivotTable . '.' . $modelMorphKey, $user->getKey())
            ->where($pivotTable . '.model_type', $user->getMorphClass())
            ->where($rolesTable . '.name', 'super admin')
            ->exists();

        // If super admin, bypass tenant filtering
        if ($hasSuperAdmin) {
            return $relation;
        }

        $teamKey = $permissionRegistrar->teamsKey;
        $teamId  = getPermissionsTeamId();

        if (empty($teamId)) {
            return $relation;
        }

        // Apply normal tenant filtering for multi-tenant users
        $teamField = config('permission.table_names.roles') . '.' . $teamKey;

        return $relation
            ->wherePivot($teamKey, $teamId)
            ->where(
                fn($query) =>
                $query->whereNull($teamField)
                    ->orWhere($teamField, $teamId)
            );
    }
}
