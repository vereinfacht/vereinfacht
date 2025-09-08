<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use LaravelJsonApi\Eloquent\SoftDeletes;

class FinanceAccount extends Model
{
    /** @use HasFactory<\Database\Factories\FinanceAccountFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'iban',
        'bic',
        'starts_at',
        'initial_balance',
        'account_type',
        'club_id',
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
