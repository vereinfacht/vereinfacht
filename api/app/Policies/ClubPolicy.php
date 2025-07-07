<?php

namespace App\Policies;

use App\Models\Club;
use Illuminate\Foundation\Auth\User;

class ClubPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view clubs');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Club $club): bool
    {
        if ($user instanceof Club) {
            return $user->id === $club->id;
        }

        return $user->can('view clubs') && $club->id === getPermissionsTeamId();
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
    public function update(User $user, Club $club): bool
    {
        if ($user instanceof Club) {
            return $user->id === $club->id;
        }

        return $user->can('update own club') && $club->id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Club $club): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Club $club): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Club $club): bool
    {
        return false;
    }

    /**
     * JSON:API relationship endpoints authorization
     */
    public function viewDivisions(User $user, Club $club): bool
    {
        return $user instanceof Club && $user->id === $club->id;
    }

    public function viewMembershipTypes(User $user, Club $club): bool
    {
        return $user instanceof Club && $user->id === $club->id;
    }

    public function viewFinanceAccounts(User $user, Club $club): bool
    {
        return $user instanceof Club && $user->id === $club->id;
    }

    public function viewTransactions(User $user, Club $club): bool
    {
        return $user instanceof Club && $user->id === $club->id;
    }
}
