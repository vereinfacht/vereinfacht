<?php

namespace App\Enums;

enum MembershipStartCycleTypeEnum: string
{
    case DAILY = 'daily';
    case MONTHLY = 'monthly';

    public static function getAllValues(): array
    {
        return array_column(MembershipStartCycleTypeEnum::cases(), 'value');
    }
}
