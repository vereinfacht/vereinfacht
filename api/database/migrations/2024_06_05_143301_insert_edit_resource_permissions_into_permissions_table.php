<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $permissionNames = [
        'update divisions',
        'update membershipTypes',
    ];

    /**
     * Run the migrations.
     */
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

        // to comply with other permission names
        DB::table('permissions')->where('name', 'edit own club')->update([
            'name' => 'update own club',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')->whereIn('name', $this->permissionNames)->delete();

        DB::table('permissions')->where('name', 'update own club')->update([
            'name' => 'edit own club',
            'updated_at' => now(),
        ]);

        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
