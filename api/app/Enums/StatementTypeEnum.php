<?php

namespace App\Enums;

enum StatementTypeEnum: string
{
    case COLLECTIVE = 'collective';
    case INDIVIDUAL = 'individual';

    public static function getAllValues(): array
    {
        return array_column(StatementTypeEnum::cases(), 'value');
    }
}
