<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $superAdminRoleName = 'super admin';

    protected $clubAdminRoleName = 'club admin';

    protected $clubAdminPermissions = [
        'view clubs',
        'view memberships',
        'create memberships',
        'update memberships',
        'create members',
        'view divisions',
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

        DB::table('roles')->insert([array_merge([
            'name' => $this->superAdminRoleName,
            'guard_name' => $this->guardName,
        ], $timestamps), array_merge([
            'name' => $this->clubAdminRoleName,
            'guard_name' => $this->guardName,
        ], $timestamps)]);

        $superAdminRole = DB::table('roles')->where('name', $this->superAdminRoleName)->first();
        $superAdminUser = DB::table('users')->where('email', 'hello@vereinfacht.digital')->first();
        $clubs = DB::table('clubs')->get();

        foreach ($clubs as $club) {
            DB::table('model_has_roles')->insert([
                'club_id' => $club->id,
                'role_id' => $superAdminRole->id,
                'model_type' => 'App\Models\User',
                'model_id' => $superAdminUser->id,
            ]);
        }

        $clubAdminRole = DB::table('roles')->where('name', $this->clubAdminRoleName)->first();

        foreach ($this->clubAdminPermissions as $permission) {
            DB::table('permissions')->insert(array_merge([
                'name' => $permission,
                'guard_name' => $this->guardName,
            ], $timestamps));

            $permissionId = DB::table('permissions')->where('name', $permission)->first()->id;

            DB::table('role_has_permissions')->insert([
                'permission_id' => $permissionId,
                'role_id' => $clubAdminRole->id,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $clubAdminRoleId = DB::table('roles')
            ->where('name', $this->clubAdminRoleName)
            ->first()
            ->id;
        $superAdminRoleId = DB::table('roles')
            ->where('name', $this->superAdminRoleName)
            ->first()
            ->id;

        DB::table('role_has_permissions')->where('role_id', $clubAdminRoleId)->delete();
        DB::table('permissions')->whereIn('name', $this->clubAdminPermissions)->delete();
        DB::table('roles')->whereIn('name', [
            $this->superAdminRoleName,
            $this->clubAdminRoleName,
        ])->delete();

        DB::table('model_has_roles')->where('role_id', $superAdminRoleId)->delete();
    }
};
