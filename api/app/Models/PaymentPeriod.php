<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Recurr\Rule;
use Recurr\Transformer\TextTransformer;
use Recurr\Transformer\Translator;

class PaymentPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'rrule',
    ];

    protected $appends = [
        'title',
    ];

    public function title(): Attribute
    {
        return Attribute::make(
            get: function () {
                return self::transformRrule($this->rrule);
            },
        );
    }

    public static function transformRrule(string $rrule): string
    {
        $rule = new Rule($rrule, now()->setDate(2024, 1, 1));
        $textTransformer = new TextTransformer(new Translator(app()->getLocale()));

        return $textTransformer->transform($rule);
    }
}
