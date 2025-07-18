<?php

namespace App\Policies;

use App\Models\Club;
use App\Models\User as UserModel;
use Illuminate\Foundation\Auth\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view users');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserModel $model): bool
    {
        return true;

        if ($user instanceof Club) {
            return $user->id === $model->club_id;
        }

        return $user->can('view users') && $model->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserModel $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserModel $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UserModel $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UserModel $model): bool
    {
        return false;
    }
}
