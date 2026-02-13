<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class TranslationTitleRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  Closure  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_array($value)) {
            $fail('Mindestens eine Sprache muss ausgefüllt sein.');
            return;
        }

        if (empty($value['de']) && empty($value['en'])) {
            $fail('Mindestens eine Sprache muss ausgefüllt sein.');
        }
    }
}
