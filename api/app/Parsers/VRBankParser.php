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

    protected function txText(array $lines): ?string
    {
        $txTextLine = $lines[1] ?? null;

        if ($txTextLine === null) {
            return null;
        }

        $cleanLine = $this->removeNewLinesFromLine($txTextLine);

        if (preg_match('/\d{3}\?00([^?$]+)/', $cleanLine, $matches)) {
            return trim($matches[1]);
        }

        return parent::txText($lines);
    }

    private function removeNewLinesFromLine(string $stringLine): string
    {
        return str_replace(["\n", "\r", "\r\n"], '', $stringLine);
    }
}
