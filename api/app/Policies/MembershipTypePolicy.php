<?php

namespace App\Policies;

use App\Models\Club;
use App\Models\MembershipType;
use Illuminate\Foundation\Auth\User;

class MembershipTypePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view membershipTypes');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MembershipType $membershipType): bool
    {
        if ($user instanceof Club) {
            return $user->id === $membershipType->club_id;
        }

        return $user->can('view membershipTypes') && $membershipType->club_id === getPermissionsTeamId();
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
    public function update(User $user, MembershipType $membershipType): bool
    {
        if ($user instanceof Club) {
            return $user->id === $membershipType->club_id;
        }

        return $user->can('update membershipTypes') && $membershipType->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MembershipType $membershipType): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MembershipType $membershipType): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MembershipType $membershipType): bool
    {
        return false;
    }
}
