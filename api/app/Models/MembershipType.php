<?php

namespace App\Models;

use App\Casts\MoneyCast;
use App\Classes\Sanitizer;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\Translatable\HasTranslations;

class MembershipType extends Model implements Sortable
{
    use HasFactory;
    use HasTranslations;
    use SortableTrait;

    public $translatable = [
        'title',
        'description',
    ];

    protected $fillable = [
        'title',
        'description',
        'admission_fee',
        'monthly_fee',
        'minimum_number_of_months',
        'minimum_number_of_members',
        'maximum_number_of_members',
    ];

    public $sortable = [
        'order_column_name' => 'sort_order',
        'sort_when_creating' => true,
        'sort_on_has_many' => true,
    ];

    protected function casts(): array
    {
        return [
            'admission_fee' => MoneyCast::class,
            'monthly_fee' => MoneyCast::class,
        ];
    }

    /**
     * Relationships
     * ------------------------------------------------------------------------
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class);
    }

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function divisions(): BelongsToMany
    {
        return $this->belongsToMany(Division::class)
            ->using(DivisionMembershipType::class)
            ->withPivot('monthly_fee')
            ->withTimestamps();
    }

    public function divisionMembershipTypes(): HasMany
    {
        return $this->hasMany(DivisionMembershipType::class);
    }

    protected function description(): Attribute
    {
        $sanitizer = new Sanitizer;

        return Attribute::make(
            get: fn (?string $value) => $sanitizer->get($value),
            set: fn (?string $value) => $sanitizer->get($value),
        );
    }
}
