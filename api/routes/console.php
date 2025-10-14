<?php

use App\Jobs\CleanupMedia;

Schedule::command('media-library:regenerate --only-missing --only=preview')
    ->everyMinute();

Schedule::job(new CleanupMedia())->dailyAt('03:00');