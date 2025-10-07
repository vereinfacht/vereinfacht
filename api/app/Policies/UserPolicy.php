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
        if ($user instanceof Club) {
            return $model->clubs->contains('id', $user->id);
        }

        return $user->can('view users') && $user->clubs->pluck('id')->intersect($model->clubs->pluck('id'))->isNotEmpty();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('create users');
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
