<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $permissionName = 'edit own club';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('permissions')->insert([
            ['name' => $this->permissionName, 'guard_name' => 'web'],
        ]);

        $permissionId = DB::table('permissions')->where('name', $this->permissionName)->first()->id;
        $clubAdminRoleId = DB::table('roles')->where('name', 'club admin')->first()->id;

        DB::table('role_has_permissions')->insert([
            ['permission_id' => $permissionId, 'role_id' => $clubAdminRoleId],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')->whereIn('name', [$this->permissionName])->delete();
    }
};
