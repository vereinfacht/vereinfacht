<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $permissionNames = [
        'view paymentPeriods',
        'create paymentPeriods',
        'update paymentPeriods',
        'delete paymentPeriods',
    ];

    public function up(): void
    {
        $now = now();

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

            if ($permissionId) {
                $roleIds = DB::table('roles')
                    ->whereIn('name', ['club admin', 'club treasurer'])
                    ->pluck('id');

                foreach ($roleIds as $roleId) {
                    DB::table('role_has_permissions')->insertOrIgnore([
                        [
                            'permission_id' => $permissionId,
                            'role_id' => $roleId,
                        ],
                    ]);
                }
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
