<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Division;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Models\MembershipType;
use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpFoundation\Response;

class ApplyTenantScopes
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request):Response $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        MembershipType::addGlobalScope(
            fn(Builder $query) => $query->whereBelongsTo(Filament::getTenant()),
        );

        Membership::addGlobalScope(
            fn(Builder $query) => $query->whereBelongsTo(Filament::getTenant()),
        );

        Division::addGlobalScope(
            fn(Builder $query) => $query->whereBelongsTo(Filament::getTenant()),
        );

        return $next($request);
    }
}
