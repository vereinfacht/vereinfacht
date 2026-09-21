<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\Activitylog\Models\Activity;

class ActivityLog extends Activity
{
    /**
     * A human readable name of the user (or club) that caused the change.
     */
    protected function causerName(): Attribute
    {
        return Attribute::get(function (): ?string {
            $causer = $this->causer;

            return match (true) {
                $causer instanceof User => $causer->name,
                $causer instanceof Club => $causer->title,
                default => null,
            };
        });
    }
}
