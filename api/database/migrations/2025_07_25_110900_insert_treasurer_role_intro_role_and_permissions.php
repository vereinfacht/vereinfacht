<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $clubTreasurerRoleName = 'club treasurer';

    protected $clubTreasurerPermissions = [
        'view memberships',
        'view membershipTypes',
        'view divisions',
        'view transactions',
        'view financeContacts',
        'view financeAccounts',
    ];

    protected $guardName = 'web';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $timestamps = [
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('roles')->insert([
            array_merge([
                'name' => $this->clubTreasurerRoleName,
                'guard_name' => $this->guardName,
            ], $timestamps),
        ]);


        $clubTreasurerRole = DB::table('roles')->where('name', $this->clubTreasurerRoleName)->first();
        foreach ($this->clubTreasurerPermissions as $permission) {
            if (!DB::table('permissions')->where('name', $permission)->exists()) {
                DB::table('permissions')->insert(array_merge([
                    'name' => $permission,
                    'guard_name' => $this->guardName,
                ], $timestamps));
            }

            $permissionId = DB::table('permissions')->where('name', $permission)->first()->id;

            DB::table('role_has_permissions')->insert([
                'permission_id' => $permissionId,
                'role_id' => $clubTreasurerRole->id,
            ]);
        }

        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')->whereIn('name', $this->clubTreasurerPermissions)->delete();
        DB::table('roles')->where('name', $this->clubTreasurerRoleName)->delete();
        DB::table('role_has_permissions')->where('role_id', DB::table('roles')->where('name', $this->clubTreasurerRoleName)->first()->id)->delete();
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
