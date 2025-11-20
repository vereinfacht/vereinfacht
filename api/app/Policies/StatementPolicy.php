<?php

namespace App\Policies;

use App\Models\Club;
use App\Models\Statement;
use Illuminate\Foundation\Auth\User;

class StatementPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view statements');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Statement $statement): bool
    {
        if ($user instanceof Club) {
            return $user->id === $statement->club_id;
        }

        return $user->can('view statements') && $statement->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('create statements');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Statement $statement): bool
    {
        if ($statement->financeAccount->account_type === 'bank_account') {
            return false;
        }

        if ($user instanceof Club) {
            return $user->id === $statement->club_id;
        }

        return $user->can('update statements') && $statement->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Statement $statement): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Statement $statement): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Statement $statement): bool
    {
        return false;
    }
}
