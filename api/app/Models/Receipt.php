<?php

namespace App\Models;

use App\Casts\MoneyCast;
use App\Enums\ReceiptStatusEnum;
use Spatie\MediaLibrary\HasMedia;
use Database\Factories\ReceiptFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use App\Models\Traits\HasPreviewConversions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Receipt extends Model implements HasMedia
{
    /** @use HasFactory<ReceiptFactory> */
    use HasFactory;
    use InteractsWithMedia;
    use HasPreviewConversions;

    protected $fillable = [
        'reference_number',
        'receipt_type',
        'booking_date',
        'amount',
        'club_id',
        'finance_contact_id',
        'tax_account_id',
    ];

    public function casts()
    {
        return [
            'booking_date' => 'datetime',
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
            return ReceiptStatusEnum::EMPTY ->value;
        }

        if ($this->tax_account_id && $transactionsSum === $receiptAmount) {
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
        return $this->hasMany(Transaction::class);
    }

    public function taxAccount()
    {
        return $this->belongsTo(TaxAccount::class);
    }
}
