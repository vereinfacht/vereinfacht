<?php

namespace App\Actions\User;

use App\Models\Scopes\ClubScope;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginActionResult
{
    public function __construct(public string $token, public User $user, public int $clubId)
    {
    }
}

class Login
{
    public function execute(Request $request): LoginActionResult
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::withoutGlobalScope(ClubScope::class)->where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $club = $user->getDefaultClub();

        if (!$club) {
            throw new AuthorizationException('The user has no association to any club.');
        }

        setPermissionsTeamId($club);

        if (!$user->hasRole('club admin')) {
            throw new AuthorizationException('Only club admins are allowed to login.');
        }

        return new LoginActionResult(
            $user->createToken('Club Admin Auth Token', ['*'], now()->addWeek())->plainTextToken,
            $user,
            $club->id,
        );
    }
}
