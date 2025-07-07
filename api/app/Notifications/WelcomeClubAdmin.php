<?php

namespace App\Notifications;

use App\Mail\WelcomeClubAdminMailable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class WelcomeClubAdmin extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): Mailable
    {
        return (new WelcomeClubAdminMailable)->to($notifiable->email);
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
