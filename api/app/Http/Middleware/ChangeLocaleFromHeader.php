<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChangeLocaleFromHeader
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request):Response $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->hasHeader('Accept-Language') &&
            in_array($request->header('Accept-Language'), config('app.supported_locales'))
        ) {
            app()->setLocale($request->header('Accept-Language'));
        }

        return $next($request);
    }
}
