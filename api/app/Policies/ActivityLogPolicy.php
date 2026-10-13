<?php

namespace App\Policies;

use App\Models\ActivityLog;
use App\Models\Club;
use Illuminate\Foundation\Auth\User;

class ActivityLogPolicy
{
    /**
     * Determine whether the user can view any models.
     *
     * Results are additionally restricted to the current club
     * by the ClubScope global scope (see App\JsonApi\V1\Server).
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view activityLogs');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ActivityLog $activityLog): bool
    {
        return $this->viewAny($user);
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
    public function update(User $user, ActivityLog $activityLog): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ActivityLog $activityLog): bool
    {
        return false;
    }
}
