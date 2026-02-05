<?php

namespace App\Filament\Resources\PaymentPeriods\Pages;

use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use App\Filament\Resources\PaymentPeriods\PaymentPeriodResource;

class ListPaymentPeriods extends ListRecords
{
    protected static string $resource = PaymentPeriodResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
