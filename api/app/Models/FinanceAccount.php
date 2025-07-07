<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceAccount extends Model
{
    /** @use HasFactory<\Database\Factories\FinanceAccountFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'iban',
        'bic',
        'starts_at',
        'initial_balance',
        'club_id',
        'finance_account_type_id',
    ];

    public function casts()
    {
        return [
            'initial_balance' => MoneyCast::class,
            'current_balance' => MoneyCast::class,
            'starts_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function type()
    {
        return $this->belongsTo(FinanceAccountType::class, 'finance_account_type_id');
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function getCurrentBalance(): float
    {
        return ($this->transactions()->sum('amount') / 100) + $this->initial_balance;
    }
}
