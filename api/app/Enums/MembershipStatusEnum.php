<?php

namespace App\Enums;

enum MembershipStatusEnum: string
{
    case APPLIED = 'applied';
    case ACTIVE = 'active';
    case CANCELLED = 'cancelled';

    public static function getAllValues(): array
    {
        return array_column(MembershipStatusEnum::cases(), 'value');
    }
}
