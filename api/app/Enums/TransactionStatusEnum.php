<?php

namespace App\Enums;

enum TransactionStatusEnum: string
{
    case COMPLETED = 'completed';
    case INCOMPLETED = 'incompleted';
    case EMPTY = 'empty';

    public static function getAllValues(): array
    {
        return array_column(TransactionStatusEnum::cases(), 'value');
    }
}
