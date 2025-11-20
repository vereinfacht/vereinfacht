<?php

namespace App\Parsers;

use Jejik\MT940\Parser\GermanBank;

class HaspaParser extends GermanBank
{
    public function accept(string $text): bool
    {
        return str_starts_with(trim($text), ':20:STARTUMS');
    }

    public function getAllowedBLZ(): array
    {
        return [
            '20050550',
        ];
    }
}
