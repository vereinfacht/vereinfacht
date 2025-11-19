<?php

namespace App\Classes;

use DateTime;

class StatementIdentifierGenerator
{
    public static function generate(DateTime $date, float $amount, string $dataString): string
    {
        $rawIdentifier = $date->format('Y-m-d') . '-' . $amount . '-' . $dataString;

        return hash('md5', $rawIdentifier);
    }
}
