<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Spatie\Translatable\Facades\Translatable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Translatable::fallback(
            fallbackAny: true,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /**
         * this is needed for laravel to generate correct urls and
         * to report the right protocol from the request() helper in a reverse proxy docker setup
         * otherwiese the request() helper will report the wrong protocol in vendor dependencies
         */
        if (App::environment('production')) {
            URL::forceScheme('https');
            $this->app['request']->server->set('HTTPS', true);
        }

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            $url = env('WEB_APPLICATION_URL', 'https://app.vereinfacht.digital');

            $locale = app()->getLocale();
            $email = urlencode($notifiable->getEmailForPasswordReset());

            return "{$url}/{$locale}/admin/auth/reset-password?token={$token}&email={$email}";
        });
    }
}
