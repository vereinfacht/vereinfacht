<?php

namespace App\Enums;

enum MemberStatusEnum: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';

    public static function getAllValues(): array
    {
        return array_column(MemberStatusEnum::cases(), 'value');
    }
}
