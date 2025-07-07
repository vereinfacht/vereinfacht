<?php

namespace App\Models\Behaviors;

trait PrefersLocale
{
    public function preferredLocale(): string
    {
        return $this->preferred_locale ?? config('app.fallback_locale');
    }
}
