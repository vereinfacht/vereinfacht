<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Database\Factories\FinanceAccountFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FinanceContact extends Model
{
    /** @use HasFactory<FinanceAccountFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'company_name',
        'gender',
        'address',
        'zip_code',
        'city',
        'country',
        'phone_number',
        'email',
        'contact_type',
        'is_external',
        'club_id',
    ];

    public function casts()
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'is_external' => 'boolean',
        ];
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function fullName(): Attribute
    {
        $fullName = trim("{$this->first_name} {$this->last_name}");

        return Attribute::make(
            get: fn() => $fullName,
        );
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }
}
