<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function createWithRoles(array $userData, string $clubId, array $roleIds = []): User
    {
        $userData = $this->mapFieldNames($userData);

        $user = User::create(collect($userData)->except(['club', 'roles'])->toArray());

        $this->assignRolesToUser($user, $clubId, $roleIds);

        return $user->load(['clubs', 'roles']);
    }

    public function updateWithRoles(User $user, array $userData, ?string $clubId = null, array $roleIds = []): User
    {
        $userData = $this->mapFieldNames($userData);

        $user->update(collect($userData)->except(['club', 'roles'])->toArray());

        if (!$clubId && $user->clubs()->exists()) {
            $clubId = $user->clubs()->first()->id;
        }

        if ($clubId) {
            $this->assignRolesToUser($user, $clubId, $roleIds, true);
        }

        return $user->load(['clubs', 'roles']);
    }

    private function mapFieldNames(array $userData): array
    {
        $fieldMappings = [
            'preferredLocale' => 'preferred_locale',
        ];

        foreach ($fieldMappings as $jsonField => $dbField) {
            if (isset($userData[$jsonField])) {
                $userData[$dbField] = $userData[$jsonField];
                unset($userData[$jsonField]);
            }
        }

        return $userData;
    }

    private function assignRolesToUser(User $user, string $clubId, array $roleIds, bool $sync = false): void
    {
        if (empty($roleIds)) {
            $roleNames = collect(['club admin']);
        } else {
            $roleNames = \Spatie\Permission\Models\Role::whereIn('id', $roleIds)->pluck('name');
        }

        setPermissionsTeamId($clubId);

        try {
            if ($sync) {
                $user->syncRoles($roleNames);
            } else {
                foreach ($roleNames as $roleName) {
                    $user->assignRole($roleName);
                }
            }
        } finally {
            setPermissionsTeamId(null);
        }
    }
}
