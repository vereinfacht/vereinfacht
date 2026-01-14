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
        $relation = $this->morphToMany(
            config('permission.models.role'),
            'model',
            config('permission.table_names.model_has_roles'),
            config('permission.column_names.model_morph_key'),
            app(PermissionRegistrar::class)->pivotRole
            // CUSTOM: adding pivot column club_id to roles relation
        )->withPivot(app(PermissionRegistrar::class)->teamsKey);
        // ENDCUSTOM

        if (!app(PermissionRegistrar::class)->teams) {
            return $relation;
        }

        // CUSTOM: return all roles without restricting by team when user is super admin
        $user = request()->user();

        if ($user) {
            $roleModel = config('permission.models.role');
            $roleInstance = app($roleModel);
            $rolesTable = $roleInstance->getTable();
            $pivotTable = config('permission.table_names.model_has_roles');
            $modelMorphKey = config('permission.column_names.model_morph_key');
            $roleIdColumn = app(PermissionRegistrar::class)->pivotRole;

            $hasSuperAdmin = DB::table($pivotTable)
                ->join($rolesTable, $rolesTable . '.id', '=', $pivotTable . '.' . $roleIdColumn)
                ->where($pivotTable . '.' . $modelMorphKey, $user->getKey())
                ->where($pivotTable . '.model_type', $user->getMorphClass())
                ->where($rolesTable . '.name', 'super admin')
                ->exists();

            if ($hasSuperAdmin) {
                return $relation;
            }
        }
        // ENDCUSTOM

        $teamField = config('permission.table_names.roles') . '.' . app(PermissionRegistrar::class)->teamsKey;

        return $relation->wherePivot(app(PermissionRegistrar::class)->teamsKey, getPermissionsTeamId())
            ->where(fn($q) => $q->whereNull($teamField)->orWhere($teamField, getPermissionsTeamId()));
    }

    /**
     * Check if user has a role across any team/club
     */
    public function hasRoleInAnyTeam(string $roleName): bool
    {
        $roleModel = config('permission.models.role');
        $roleInstance = app($roleModel);
        $rolesTable = $roleInstance->getTable();
        $pivotTable = config('permission.table_names.model_has_roles');
        $modelMorphKey = config('permission.column_names.model_morph_key');
        $roleIdColumn = app(PermissionRegistrar::class)->pivotRole;

        return DB::table($pivotTable)
            ->join($rolesTable, $rolesTable . '.id', '=', $pivotTable . '.' . $roleIdColumn)
            ->where($pivotTable . '.' . $modelMorphKey, $this->getKey())
            ->where($pivotTable . '.model_type', $this->getMorphClass())
            ->where($rolesTable . '.name', $roleName)
            ->exists();
    }
}
