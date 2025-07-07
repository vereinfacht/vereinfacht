<?php

namespace App\Enums;

enum GenderOptionEnum: string
{
    case MALE = 'male';
    case FEMALE = 'female';
    case OTHER = 'other';

    public static function getAllValues(): array
    {
        return array_column(GenderOptionEnum::cases(), 'value');
    }
}
