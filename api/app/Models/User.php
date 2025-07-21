<?php

namespace App\Models;

use App\Models\Behaviors\HasRoles;
use App\Models\Behaviors\PrefersLocale;
use App\Models\Scopes\ClubScope;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Role;

class User extends Authenticatable implements FilamentUser, HasLocalePreference, HasTenants
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable, PrefersLocale;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'preferred_locale',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationships
     * ------------------------------------------------------------------------
     */
    public function clubs(): MorphToMany
    {
        return $this->morphToMany(
            Club::class,
            'model',
            'model_has_roles',
            'model_id',
            'club_id'
        );
    }

    public function isSuperAdmin(): bool
    {
        // ATTENTION: This means, that having one super admin role will
        // (at least in some cases) make the user act as super admin for
        // all clubs without requiring them to be assigned for each club individually.
        // Always setting the permissionsTeamId on requests / the session can
        // make this hacky solution obsolute in future, but requires more refactoring.
        return Role::where('name', 'super admin')
            ->first()
            ?->users()
            ->where('id', $this->id)
            ->exists() ?? false;
    }

    public function getTenants(Panel $panel): Collection
    {
        return $this->clubs;
    }

    public function canAccessTenant(Model $tenant): bool
    {
        return $this->clubs()->whereKey($tenant)->exists();
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isSuperAdmin();
    }

    public function getDefaultClub(): ?Club
    {
        return $this->clubs()->withoutGlobalScope(ClubScope::class)->first();
    }
}
