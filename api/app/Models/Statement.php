<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Statement extends Model
{
    /** @use HasFactory<\Database\Factories\StatementFactory> */
    use HasFactory;

    protected $fillable = [
        'finance_account_id',
        'club_id',
        'identifier',
        'date',
    ];

    public function casts()
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'date' => 'datetime',
            'amount' => MoneyCast::class,
        ];
    }

    /**
     * Relationships
     * ------------------------------------------------------------------------
     */
    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function financeAccount()
    {
        return $this->belongsTo(FinanceAccount::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function getAmount(): float
    {
        return ($this->transactions()->sum('amount') / 100);
    }
}
