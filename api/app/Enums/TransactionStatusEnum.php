<?php

namespace App\Enums;

enum TransactionStatusEnum: string
{
    case INCOMPLETED = 'incompleted';
    case PENDING = 'pending';
    case COMPLETED = 'completed';

    public static function getAllValues(): array
    {
        return array_column(TransactionStatusEnum::cases(), 'value');
    }
}
