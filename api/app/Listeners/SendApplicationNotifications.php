<?php

namespace App\Listeners;

use App\Events\AppliedForMembership;
use App\Models\Membership;
use App\Notifications\ApplicationReceived;
use App\Notifications\NewApplication;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;

class SendApplicationNotifications implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AppliedForMembership $event): void
    {
        $membership = $event->membership;

        Notification::send(
            $this->getMemberNotifiables($membership),
            new ApplicationReceived($membership)
        );
        Notification::send($membership->club, new NewApplication($event->membership));
    }

    protected function getMemberNotifiables(Membership $membership): Collection
    {
        $owner = $membership->owner;

        return $membership->members->filter(function ($member) use ($owner) {
            if ($member->id === $owner->id) {
                return true;
            }

            return $member->email !== $owner->email;
        });
    }
}
