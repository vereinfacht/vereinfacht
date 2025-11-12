<?php

namespace App\Models;

use App\Casts\MoneyCast;
use App\Enums\TransactionStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'gvc',
        'bank_iban',
        'bank_account_holder',
        'statement_id',
        'currency',
        'amount',
        'valued_at',
        'booked_at',
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

    /**
     * Relationships
     * ------------------------------------------------------------------------
     */
    public function receipts()
    {
        return $this->belongsToMany(Receipt::class, 'receipt_transaction');
    }

    public function statement()
    {
        return $this->belongsTo(Statement::class);
    }

    public function club()
    {
        return $this->statement->club();
    }

    public function financeAccount()
    {
        return $this->hasOneThrough(
            FinanceAccount::class,
            Statement::class,
            'id',
            'id',
            'statement_id',
            'finance_account_id',
        );
    }

    public function scopeUnassigned($query)
    {
        return $query->whereDoesntHave('receipts');
    }

    public function getStatusAttribute(): string
    {
        if ($this->receipts()->count() === 0) {
            return TransactionStatusEnum::EMPTY->value;
        }

        $receiptsSum = (int) $this->receipts()->sum('amount');
        $transactionAmount = is_object($this->amount) && method_exists($this->amount, 'getAmount')
            ? (int) $this->amount->getAmount()
            : (int) round($this->amount * 100);

        if ($receiptsSum == $transactionAmount) {
            return TransactionStatusEnum::COMPLETED->value;
        }

        return TransactionStatusEnum::INCOMPLETED->value;
    }
}
