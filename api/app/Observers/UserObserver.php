<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function created(User $user): void
    {
        $this->handleRoleAssignment($user);
    }

    public function updated(User $user): void
    {
        $this->handleRoleAssignment($user);
    }

    private function handleRoleAssignment(User $user): void
    {
        $club = $user->clubs()->first();

        if (!$club) {
            return;
        }

        $roles = $user->getRelationValue('roles');

        if (!$roles || $roles->isEmpty()) {
            $roleNames = ['club admin'];
        } else {
            $roleNames = $roles->pluck('name')->toArray();
        }

        setPermissionsTeamId($club->id);

        try {
            $user->syncRoles($roleNames);
        } finally {
            setPermissionsTeamId(null);
        }
    }
}
