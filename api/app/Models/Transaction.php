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
        $receiptsCount = $this->receipts()->count();
        $receiptsSum = (int) $this->receipts()->sum('amount');
        $transactionAmount = is_object($this->amount) && method_exists($this->amount, 'getAmount')
            ? (int) $this->amount->getAmount()
            : (int) round($this->amount * 100);

        if ($receiptsCount === 0) {
            return TransactionStatusEnum::EMPTY->value;
        }

        if ($receiptsSum == $transactionAmount) {
            return TransactionStatusEnum::COMPLETED->value;
        }

        return TransactionStatusEnum::INCOMPLETED->value;
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
