<?php

namespace App\Policies;

use App\Models\Club;
use App\Models\FinanceAccount;
use Illuminate\Foundation\Auth\User;

class FinanceAccountPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view financeAccounts');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, FinanceAccount $financeAccount): bool
    {
        if ($user instanceof Club) {
            return $user->id === $financeAccount->club_id;
        }

        return $user->can('view financeAccounts') && $financeAccount->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('create financeAccounts');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, FinanceAccount $financeAccount): bool
    {
        if ($user instanceof Club) {
            return $user->id === $financeAccount->club_id;
        }

        return $user->can('update financeAccounts') && $financeAccount->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FinanceAccount $financeAccount): bool
    {
        if ($user instanceof Club) {
            return $user->id === $financeAccount->club_id;
        }

        return $user->can('delete financeAccounts') && $financeAccount->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, FinanceAccount $financeAccount): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, FinanceAccount $financeAccount): bool
    {
        return false;
    }

    public function viewStatements(User $user, FinanceAccount $financeAccount): bool
    {
        if ($user instanceof Club) {
            return $user->id === $financeAccount->club_id;
        }

        return $user->can('view statements') && $financeAccount->club_id === getPermissionsTeamId();
    }
}
