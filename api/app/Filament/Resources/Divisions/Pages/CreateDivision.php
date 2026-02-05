<?php

namespace App\Filament\Resources\Divisions\Pages;

use Filament\Resources\Pages\CreateRecord;
use App\Filament\Resources\Divisions\DivisionResource;
use LaraZeus\SpatieTranslatable\Actions\LocaleSwitcher;
use LaraZeus\SpatieTranslatable\Resources\Pages\CreateRecord\Concerns\Translatable;

class CreateDivision extends CreateRecord
{
    use Translatable;

    protected static string $resource = DivisionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            LocaleSwitcher::make(),
        ];
    }
}
