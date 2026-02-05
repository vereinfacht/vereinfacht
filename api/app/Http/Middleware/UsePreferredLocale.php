<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UsePreferredLocale
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request):Response $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (filled($user)) {
            app()->setLocale($user?->preferred_locale ?? config('app.fallback_locale'));
        }

        return $next($request);
    }
}
