<?php

namespace App\Enums;

enum FinanceAccountTypeEnum: string
{
    case BANK_ACCOUNT = 'bank_account';
    case CASH_BOX = 'cash_box';

    public static function getAllValues(): array
    {
        return array_column(FinanceAccountTypeEnum::cases(), 'value');
    }
}
