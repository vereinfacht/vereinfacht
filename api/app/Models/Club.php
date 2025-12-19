<?php

namespace App\Models;

use App\Classes\Sanitizer;
use Illuminate\Support\Str;
use Filament\Facades\Filament;
use Laravel\Sanctum\HasApiTokens;
use Filament\Models\Contracts\HasName;
use App\Models\Behaviors\PrefersLocale;
use Filament\Models\Contracts\HasAvatar;
use Illuminate\Notifications\Notifiable;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Club extends Authenticatable implements HasAvatar, HasLocalePreference, HasName
{
    use HasApiTokens;
    use HasFactory;
    use HasTranslations;
    use Notifiable;
    use PrefersLocale;

    public $translatable = [
        'apply_title',
    ];

    protected $fillable = [
        'title',
        'extended_title',
        'apply_title',
        'address',
        'zip_code',
        'city',
        'country',
        'preferred_locale',
        'email',
        'website_url',
        'primary_color',
        'logo_url',
        'privacy_statement_url',
        'contribution_statement_url',
        'constitution_url',
        'membership_start_cycle_type',
        'allow_voluntary_contribution',
        'has_consented_media_publication_is_required',
        'has_consented_media_publication_default_value',
        'tax_account_chart_id',
    ];

    protected function casts(): array
    {
        return [
            'allow_voluntary_contribution' => 'boolean',
            'has_consented_media_publication_is_required' => 'boolean',
            'has_consented_media_publication_default_value' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Club $club) {
            if (!$club->slug) {
                $club->slug = Str::slug($club->title);
                // currently setting tax_account_chart_id to the first TaxAccountChart
                $club->tax_account_chart_id = TaxAccountChart::first()?->id ?? null;
            }
        });

        self::created(function ($model) {
            // make our global super admin user a super admin on club creation
            // see App\Models\User.php: isSuperAdmin() for more information
            $session_team_id = getPermissionsTeamId() ?? Filament::getTenant()?->id;

            setPermissionsTeamId($model);

            User::whereHas('roles', function ($query) {
                $query->where('name', 'super admin');
            })->first()?->assignRole('super admin');

            setPermissionsTeamId($session_team_id);
        });
    }

    /**
     * Relationships
     * ------------------------------------------------------------------------
     */
    public function divisions(): HasMany
    {
        return $this->hasMany(Division::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class);
    }

    public function membershipTypes(): HasMany
    {
        return $this->hasMany(MembershipType::class)->orderBy('sort_order');
    }

    public function paymentPeriods(): BelongsToMany
    {
        return $this->belongsToMany(PaymentPeriod::class);
    }

    public function financeAccounts(): HasMany
    {
        return $this->hasMany(FinanceAccount::class);
    }

    public function financeContacts(): HasMany
    {
        return $this->hasMany(FinanceContact::class);
    }

    public function transactions()
    {
        return $this->hasManyThrough(
            Transaction::class,
            Statement::class,
            'club_id',
            'statement_id',
            'id',
            'id'
        );
    }

    public function statements(): HasMany
    {
        return $this->hasMany(Statement::class);
    }

    public function taxAccountChart()
    {
        return $this->belongsTo(TaxAccountChart::class);
    }

    /**
     * Attributes
     * ------------------------------------------------------------------------
     */
    protected function applyTitle(): Attribute
    {
        $sanitizer = new Sanitizer;

        return Attribute::make(
            get: fn(?string $value) => $value ? $sanitizer->get($value) : null,
            set: fn(?string $value) => $value ? $sanitizer->get($value) : null,
        );
    }

    public function applyUrl(): Attribute
    {
        $url = env('WEB_APPLICATION_URL', 'https://app.vereinfacht.digital');
        $url .= '/de/';
        $url .= $this->slug;
        $url .= '/apply';

        return Attribute::make(
            get: fn() => $url,
        );
    }

    public function getFilamentName(): string
    {
        return $this->title;
    }

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->logo_url;
    }
}
