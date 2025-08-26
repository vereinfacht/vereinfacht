<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    /** @use HasFactory<\Database\Factories\ReceiptFactory> */
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'type',
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
        ];
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
