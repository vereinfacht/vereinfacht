<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\CpuLoadHealthCheck\CpuLoadCheck;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\DebugModeCheck;
use Spatie\Health\Checks\Checks\EnvironmentCheck;
use Spatie\Health\Checks\Checks\PingCheck;
use Spatie\Health\Checks\Checks\QueueCheck;
use Spatie\Health\Checks\Checks\ScheduleCheck;
use Spatie\Health\Checks\Checks\UsedDiskSpaceCheck;
use Spatie\Health\Facades\Health;
use Spatie\SecurityAdvisoriesHealthCheck\SecurityAdvisoriesCheck;

class HealthCheckServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $webApplicationUrl = env('WEB_APPLICATION_URL', 'https://app.vereinfacht.digital');
        $clubManagementLoginUrl = $webApplicationUrl.'/de/admin/auth/login';
        $demoClubApplyFormUrl = $webApplicationUrl.'/de/tsv-muster/apply';

        Health::checks([
            CacheCheck::new(),
            CpuLoadCheck::new()
                ->failWhenLoadIsHigherInTheLast5Minutes(2.0)
                ->failWhenLoadIsHigherInTheLast15Minutes(1.5),
            DatabaseCheck::new(),
            DebugModeCheck::new(),
            EnvironmentCheck::new()->expectEnvironment('production'),
            PingCheck::new()->url($clubManagementLoginUrl)->name('Club management login'),
            PingCheck::new()->url($demoClubApplyFormUrl)->name('Demo club apply form'),
            QueueCheck::new(),
            ScheduleCheck::new()->heartbeatMaxAgeInMinutes(2),
            SecurityAdvisoriesCheck::new(),
            UsedDiskSpaceCheck::new(),
        ]);
    }
}
