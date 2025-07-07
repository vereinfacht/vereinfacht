<?php

namespace App\Actions\User;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Logout
{
    public function execute(Request $request): bool
    {
        $user = Auth::user();

        if (! $user) {
            throw new Exception('No user with this token is currently logged in.');
        }

        $user->currentAccessToken()->delete();

        return true;
    }
}
