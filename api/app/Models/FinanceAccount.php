<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\FinanceAccountFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FinanceAccount extends Model
{
    /** @use HasFactory<FinanceAccountFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'iban',
        'bic',
        'starts_at',
        'initial_balance',
        'account_type',
        'club_id'
    ];

    public function casts()
    {
        return [
            'initial_balance' => MoneyCast::class,
            'current_balance' => MoneyCast::class,
            'starts_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function statements()
    {
        return $this->hasMany(Statement::class);
    }

    public function getCurrentBalance(): float
    {
        $initialBalance = $this->initial_balance ?? 0;
        $transactionsSum = $this->statements()->withSum('transactions', 'amount')->get()->sum('transactions_sum_amount');
        return ($transactionsSum / 100) + $initialBalance;
    }
}
