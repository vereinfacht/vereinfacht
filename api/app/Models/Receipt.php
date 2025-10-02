<?php

namespace App\Models;

use App\Casts\MoneyCast;
use App\Enums\ReceiptStatusEnum;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use App\Models\Traits\HasPreviewConversions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Receipt extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\ReceiptFactory> */
    use HasFactory, InteractsWithMedia, HasPreviewConversions;

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
        $transactionsCount = $this->transactions()->count();
        $transactionsSum = (int) $this->transactions()->sum('amount');
        $receiptAmount = is_object($this->amount) && method_exists($this->amount, 'getAmount')
            ? (int) $this->amount->getAmount()
            : (int) round($this->amount * 100);

        if ($transactionsCount === 0) {
            return ReceiptStatusEnum::EMPTY->value;
        }

        if ($transactionsSum == $receiptAmount) {
            return ReceiptStatusEnum::COMPLETED->value;
        }

        return ReceiptStatusEnum::INCOMPLETED->value;
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerPreviewConversion($media);
    }

    // Relations
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
