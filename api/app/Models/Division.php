<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Translatable\HasTranslations;

class Division extends Model
{
    use HasFactory;
    use HasTranslations;

    public $translatable = [
        'title',
    ];

    protected $fillable = [
        'title',
        'club_id',
    ];

    /**
     * Relationships
     * ------------------------------------------------------------------------
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class);
    }

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function membershipTypes(): BelongsToMany
    {
        return $this->belongsToMany(MembershipType::class)
            ->using(DivisionMembershipType::class)
            ->withPivot('monthly_fee')
            ->withTimestamps();
    }
}
