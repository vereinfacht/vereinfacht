<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    protected $permissionNames = [
        'view permissions',
        'create permissions',
        'update permissions',
        'delete permissions',
    ];

    public function up(): void
    {
        $now = now();

        foreach ($this->permissionNames as $permissionName) {
            DB::table('permissions')->insert([
                [
                    'name' => $permissionName,
                    'guard_name' => 'web',
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ]);

            $permissionId = DB::table('permissions')->where('name', $permissionName)->first()->id;
            $clubAdminRoleId = DB::table('roles')->where('name', 'club admin')->first()->id;

            DB::table('role_has_permissions')->insert([
                ['permission_id' => $permissionId, 'role_id' => $clubAdminRoleId],
            ]);
        }

        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')->whereIn('name', $this->permissionNames)->delete();

        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
