<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $permissionNames = [
        'view members',
        'create members',
        'update members',
        'delete members',
        'delete memberships',
    ];

    public function up(): void
    {
        $now = now();
        $clubAdminRoleId = DB::table('roles')->where('name', 'club admin')->first()?->id;

        foreach ($this->permissionNames as $permissionName) {
            DB::table('permissions')->insertOrIgnore([
                [
                    'name' => $permissionName,
                    'guard_name' => 'web',
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ]);

            $permissionId = DB::table('permissions')->where('name', $permissionName)->first()?->id;

            if ($permissionId && $clubAdminRoleId) {
                DB::table('role_has_permissions')->insertOrIgnore([
                    ['permission_id' => $permissionId, 'role_id' => $clubAdminRoleId],
                ]);
            }
        }

        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        DB::table('permissions')->whereIn('name', $this->permissionNames)->delete();

        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
