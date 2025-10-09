<?php

namespace App\Policies;

use App\Models\Club;
use App\Models\Media;
use Illuminate\Foundation\Auth\User;

class MediaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view media');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Media $media): bool
    {
        if ($user instanceof Club) {
            return $user->id === $media->club_id;
        }

        return $user->can('view media') && $media->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('create media');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Media $media): bool
    {
        if ($user instanceof Club) {
            return $user->id === $media->club_id;
        }

        return $user->can('update media') && $media->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Media $media): bool
    {
        if ($user instanceof Club) {
            return $user->id === $media->club_id;
        }

        return $user->can('delete media') && $media->club_id === getPermissionsTeamId();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Media $media): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Media $media): bool
    {
        return false;
    }
}
