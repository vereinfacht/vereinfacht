<?php

namespace App\Models;

use App\Casts\MoneyCast;
use App\Enums\ReceiptStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Receipt extends Model
{
    /** @use HasFactory<\Database\Factories\ReceiptFactory> */
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'receipt_type',
        'document_date',
        'amount',
        'club_id',
        'finance_contact_id',
    ];

    public function casts()
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'amount' => MoneyCast::class,
        ];
    }

    public function getStatusAttribute(): string
    {
        return $this->transactions()->exists() ? ReceiptStatusEnum::COMPLETED->value : ReceiptStatusEnum::INCOMPLETED->value;
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function financeContact()
    {
        return $this->belongsTo(FinanceContact::class);
    }

    public function transactions()
    {
        return $this->belongsToMany(Transaction::class, 'receipt_transaction');
    }
}
