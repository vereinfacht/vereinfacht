<?php

namespace App\Enums;

enum ReceiptStatusEnum: string
{
    case COMPLETED = 'completed';
    case INCOMPLETED = 'incompleted';
    case EMPTY = 'empty';

    public static function getAllValues(): array
    {
        return array_column(ReceiptStatusEnum::cases(), 'value');
    }
}
