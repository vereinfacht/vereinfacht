<?php

namespace App\Policies;

use App\Models\Club;
use App\Models\DivisionMembershipType;
use Illuminate\Foundation\Auth\User;

class DivisionMembershipTypePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view divisions') && $user->can('view membershipTypes');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, DivisionMembershipType $divisionMembershipType): bool
    {
        if ($user instanceof Club) {
            return $user->id === $divisionMembershipType->division->club_id;
        }

        return ($user->can('view divisions') && $user->can('view membershipTypes')) && $divisionMembershipType->division->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('update divisions') && $user->can('update membershipTypes');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, DivisionMembershipType $divisionMembershipType): bool
    {
        if ($user instanceof Club) {
            return $user->id === $divisionMembershipType->division->club_id;
        }

        return ($user->can('update divisions') && $user->can('update membershipTypes')) && $divisionMembershipType->division->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DivisionMembershipType $divisionMembershipType): bool
    {
        if ($user instanceof Club) {
            return $user->id === $divisionMembershipType->division->club_id;
        }

        return ($user->can('update divisions') && $user->can('update membershipTypes')) && $divisionMembershipType->division->club_id === getPermissionsTeamId();
    }
}
