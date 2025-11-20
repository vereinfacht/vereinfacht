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
        'receipt_id',
        'currency',
        'amount',
        'currency',
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
    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
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
        return $query->whereNull('receipt_id');
    }

    public function getStatusAttribute(): string
    {
        return $this->receipt_id ? TransactionStatusEnum::COMPLETED->value : TransactionStatusEnum::EMPTY->value;
    }
}
