<?php

namespace App\Classes;

use NumberFormatter;

class Currency
{
    public function __construct(
        protected mixed $value,
        protected string $locale = 'de',
        protected string $currency = 'EUR'
    ) {}

    public function formatted(): string
    {
        return $this->formatter()->formatCurrency(
            $this->value,
            $this->currency
        );
    }

    protected function formatter()
    {
        return new NumberFormatter($this->locale, NumberFormatter::CURRENCY);
    }
}
