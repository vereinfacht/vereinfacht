<?php

namespace App\Models;

use Filament\Panel;
use App\Models\Scopes\ClubScope;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Behaviors\HasRoles;
use Illuminate\Support\Collection;
use App\Models\Behaviors\PrefersLocale;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\HasTenants;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Translation\HasLocalePreference;

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
        if (getPermissionsTeamId()) {
            return $this->hasRole('super admin');
        }

        return $this->hasRoleInAnyTeam('super admin');
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
