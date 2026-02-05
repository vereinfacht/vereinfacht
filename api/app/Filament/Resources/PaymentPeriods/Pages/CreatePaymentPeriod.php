<?php

namespace App\Filament\Resources\PaymentPeriods\Pages;

use Filament\Resources\Pages\CreateRecord;
use App\Filament\Resources\PaymentPeriods\PaymentPeriodResource;

class CreatePaymentPeriod extends CreateRecord
{
    protected static string $resource = PaymentPeriodResource::class;
}
