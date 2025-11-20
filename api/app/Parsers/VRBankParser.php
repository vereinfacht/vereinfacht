<?php

namespace App\Parsers;

use Jejik\MT940\Parser\GermanBank;

class VRBankParser extends GermanBank
{
    public function accept(string $text): bool
    {
        return str_starts_with(trim($text), ':20:NONREF');
    }

    public function getAllowedBLZ(): array
    {
        return [];
    }
}
