<?php

namespace App\Models\Behaviors;

use App\Models\User;
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

        // CUSTOM: allow roles management for super admin user by
        // returning the relation without any further club filtering
        $user = request()->user();
        $isSuperAdminUser = $user instanceof User
            && $user->isSuperAdmin()
            && ! getPermissionsTeamId();

        if (! app(PermissionRegistrar::class)->teams || $isSuperAdminUser) {
            return $relation;
        }
        // ENDCUSTOM

        $teamField = config('permission.table_names.roles').'.'.app(PermissionRegistrar::class)->teamsKey;

        return $relation->wherePivot(app(PermissionRegistrar::class)->teamsKey, getPermissionsTeamId())
            ->where(fn ($q) => $q->whereNull($teamField)->orWhere($teamField, getPermissionsTeamId()));
    }
}
