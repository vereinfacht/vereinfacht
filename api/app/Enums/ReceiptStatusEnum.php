<?php

namespace App\Enums;

enum ReceiptStatusEnum: string
{
    case INCOMPLETED = 'incompleted';
    case COMPLETED = 'completed';

    public static function getAllValues(): array
    {
        return array_column(ReceiptStatusEnum::cases(), 'value');
    }
}
