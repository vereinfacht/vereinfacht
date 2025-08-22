<?php

namespace App\Policies;

use App\Models\Club;
use App\Models\Receipt;
use Illuminate\Foundation\Auth\User;

class ReceiptPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view receipts');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Receipt $receipt): bool
    {
        if ($user instanceof Club) {
            return $user->id === $receipt->club_id;
        }

        return $user->can('view receipts') && $receipt->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('create receipts');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Receipt $receipt): bool
    {
        if ($user instanceof Club) {
            return $user->id === $receipt->club_id;
        }

        return $user->can('update receipts') && $receipt->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Receipt $receipt): bool
    {
        if ($user instanceof Club) {
            return $user->id === $receipt->club_id;
        }

        return $user->can('delete receipts') && $receipt->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Receipt $receipt): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Receipt $receipt): bool
    {
        return false;
    }
}
