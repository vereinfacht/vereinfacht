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
            // CUSTOM: adding pivot column club_id to roles relation
        )->withPivot($permissionRegistrar->teamsKey);
        // ENDCUSTOM

        if (! $permissionRegistrar->teams) {
            return $relation;
        }

        // CUSTOM: return all roles without restricting by team when user is super admin
        $user = $this;

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

        if ($hasSuperAdmin) {
            return $relation;
        }
        // ENDCUSTOM

        $teamKey = $permissionRegistrar->teamsKey;
        $teamId  = getPermissionsTeamId();

        // CUSTOM: modify to include roles without team assigned
        if (empty($teamId)) {
            return $relation;
        }
        // ENDCUSTOM

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
