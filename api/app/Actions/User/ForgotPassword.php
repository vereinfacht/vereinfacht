<?php

namespace App\Actions\User;

use App\Models\Scopes\ClubScope;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPassword
{
    public function execute(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        return Password::sendResetLink(
            array_merge(
                $request->only('email'),
                [
                    'ignore_scopes' => function ($query) {
                        $query->withoutGlobalScope(ClubScope::class);
                    }
                ]
            )
        );
    }
}
