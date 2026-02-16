<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class TranslationTitleRule implements ValidationRule
{
    /**
     * Get supported locales from config.
     */
    private static function getSupportedLocales(): array
    {
        return config('app.supported_locales', []);
    }

    /**
     * Get validation rules for supported locale fields.
     */
    public static function getLocaleRules(): array
    {
        $rules = [];
        foreach (self::getSupportedLocales() as $locale) {
            $rules["titleTranslations.$locale"] = ['nullable', 'string', 'min:2'];
        }
        return $rules;
    }

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
            $fail(__('validation.custom.title_translation.required'));
            return;
        }

        foreach (self::getSupportedLocales() as $locale) {
            if (!empty($value[$locale])) {
                return;
            }
        }

        $fail(__('validation.custom.title_translation.required'));
    }
}
