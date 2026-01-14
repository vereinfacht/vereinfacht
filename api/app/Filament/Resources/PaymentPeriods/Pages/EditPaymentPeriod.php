<?php

namespace App\Filament\Resources\PaymentPeriods\Pages;

use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use App\Filament\Resources\PaymentPeriods\PaymentPeriodResource;

class EditPaymentPeriod extends EditRecord
{
    protected static string $resource = PaymentPeriodResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
