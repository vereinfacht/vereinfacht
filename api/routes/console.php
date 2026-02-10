<?php

use App\Jobs\CleanupMedia;

Schedule::job(new CleanupMedia())->dailyAt('03:00');
