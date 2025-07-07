<?php

namespace App\Http\Middleware;

use App\Models\Club;
use App\Models\User;
use Illuminate\Contracts\Auth\authenticatable;
use Illuminate\Support\Facades\Auth;

class ClubPermission
{
    public function handle($request, \Closure $next)
    {
        $authenticable = Auth::guard('sanctum')->user();

        if (! empty($authenticable)) {
            $clubId = $this->getCurrentPermissionsClubId($authenticable);

            if (! $clubId) {
                return abort(403);
            }

            setPermissionsTeamId($clubId);
        }

        return $next($request);
    }

    protected function getCurrentPermissionsClubId(Authenticatable $authenticatable)
    {
        // @TODO: let the user choose the club they want to manage
        // Currently: it will be the first club the user is part of.
        // Remember to check the ClubScope for adjustments needed when
        // allowing users to influence the club_id within the session.
        if ($authenticatable instanceof Club) {
            return $authenticatable->id;
        }

        if ($authenticatable instanceof User) {
            return $authenticatable->getDefaultClub()?->id;
        }

    }
}
