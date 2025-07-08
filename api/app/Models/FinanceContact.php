<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceContact extends Model
{
    /** @use HasFactory<\Database\Factories\FinanceAccountFactory> */
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
        'type',
        'club_id',
    ];

    public function casts()
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }
}
