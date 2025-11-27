<?php

namespace App\Models;

use App\Casts\MoneyCast;
use App\Enums\TransactionStatusEnum;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
        'statement_type',
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

    protected function title(): Attribute
    {
        $firstTransaction = $this->transactions()->first();

        if (!$firstTransaction) {
            return Attribute::make(
                get: fn() => 'Statement #' . $this->identifier,
            );
        }

        return Attribute::make(
            get: fn() => $firstTransaction?->bank_account_holder ?? $firstTransaction->title,
        );
    }

    protected function status(): Attribute
    {
        return Attribute::make(
            get: function () {
                $totalTransactions = $this->transactions()->count();

                if ($totalTransactions === 0) {
                    return TransactionStatusEnum::EMPTY;
                }

                $unassignedCount = $this->transactions()->unassigned()->count();

                if ($unassignedCount === $totalTransactions) {
                    return TransactionStatusEnum::EMPTY;
                }

                if ($unassignedCount === 0) {
                    return TransactionStatusEnum::COMPLETED;
                }

                return TransactionStatusEnum::INCOMPLETED;
            }
        );
    }
}
