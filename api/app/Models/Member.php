<?php

namespace App\Models;

use App\Models\Behaviors\PrefersLocale;
use App\Models\Traits\HasPreviewConversions;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Member extends Model implements HasLocalePreference, HasMedia
{
    use HasFactory;
    use Notifiable;
    use PrefersLocale;
    use InteractsWithMedia;
    use HasPreviewConversions;

    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'address',
        'zip_code',
        'city',
        'country',
        'preferred_locale',
        'birthday',
        'phone_number',
        'email',
        'club_id',
        'consented_media_publication_at',
        'status',
    ];

    protected $casts = [
        'birthday' => 'date',
        'consented_media_publication_at' => 'datetime',
    ];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerPreviewConversion($media);
    }

    /**
     * Relationships
     * ------------------------------------------------------------------------
     */
    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class);
    }

    public function divisions(): BelongsToMany
    {
        return $this->belongsToMany(Division::class);
    }

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn() => "{$this->first_name} {$this->last_name}",
        );
    }
}
