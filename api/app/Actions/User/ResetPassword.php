<?php

namespace App\Actions\User;

use App\Models\Scopes\ClubScope;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
class ResetPassword
{
    public function execute(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8', 'max:255', 'confirmed']
        ]);

        $credentials = array_merge(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            [
                'ignore_scopes' => function ($query) {
                    $query->withoutGlobalScope(ClubScope::class);
                }
            ]
        );

        $status = Password::reset(
            $credentials,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status;
    }
}

