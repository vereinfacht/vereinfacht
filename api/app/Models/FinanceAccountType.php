<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class FinanceAccountType extends Model
{
    /** @use HasFactory<\Database\Factories\FinanceAccountTypeFactory> */
    use HasFactory;

    use HasTranslations;

    public $translatable = [
        'title',
    ];

    protected $fillable = [
        'title',
    ];
}
