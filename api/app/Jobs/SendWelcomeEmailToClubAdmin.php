<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\WelcomeClubAdmin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Notification;

class SendWelcomeEmailToClubAdmin implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public User $user)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Notification::send(
            $this->user,
            new WelcomeClubAdmin
        );
    }
}
