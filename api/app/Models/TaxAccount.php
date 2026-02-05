<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Database\Factories\TaxAccountFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaxAccount extends Model
{
    /** @use HasFactory<TaxAccountFactory> */
    use HasFactory;

    protected $fillable = [
        'account_number',
        'description',
        'tax_account_chart_id',
        'club_id',
    ];

    public function casts()
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function taxAccountChart()
    {
        return $this->belongsTo(TaxAccountChart::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }
}
