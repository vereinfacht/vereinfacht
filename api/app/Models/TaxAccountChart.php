<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaxAccountChart extends Model
{
    /** @use HasFactory<\Database\Factories\TaxAccountChartFactory> */
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
