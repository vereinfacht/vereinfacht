<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Database\Factories\TaxAccountChartFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaxAccountChart extends Model
{
    /** @use HasFactory<TaxAccountChartFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
    ];

    public function casts()
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
