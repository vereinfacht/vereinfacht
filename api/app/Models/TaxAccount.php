<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaxAccount extends Model
{
    /** @use HasFactory<\Database\Factories\TaxAccountFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'reference_number',
    ];

    public function casts()
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
