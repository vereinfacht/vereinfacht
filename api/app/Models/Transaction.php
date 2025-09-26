<?php

namespace App\Models;

use App\Casts\MoneyCast;
use App\Enums\TransactionStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'amount',
        'valued_at',
        'booked_at',
        'finance_account_id',
        'club_id',
    ];

    public function casts()
    {
        return [
            'valued_at' => 'datetime',
            'booked_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'amount' => MoneyCast::class,
        ];
    }

    public function getStatusAttribute(): string
    {
        return $this->receipts()->exists() ? TransactionStatusEnum::COMPLETED->value : TransactionStatusEnum::INCOMPLETED->value;
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

    public function receipts()
    {
        return $this->belongsToMany(Receipt::class, 'receipt_transaction');
    }
}
