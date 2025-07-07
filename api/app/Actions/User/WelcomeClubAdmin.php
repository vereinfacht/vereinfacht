<?php

namespace App\Actions\User;

use App\Jobs\SendWelcomeEmailToClubAdmin;
use App\Models\User;
use ErrorException;

class WelcomeClubAdmin
{
    public function execute(User $user): void
    {
        if (! $user->hasRole('club admin')) {
            throw new ErrorException('User does not have the role of club admin');
        }

        SendWelcomeEmailToClubAdmin::dispatch($user);
    }
}
