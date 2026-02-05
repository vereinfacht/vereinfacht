<?php

namespace App\Filament\Resources\Clubs\Pages;

use Filament\Resources\Pages\CreateRecord;
use App\Filament\Resources\Clubs\ClubResource;
use LaraZeus\SpatieTranslatable\Actions\LocaleSwitcher;
use LaraZeus\SpatieTranslatable\Resources\Pages\CreateRecord\Concerns\Translatable;

class CreateClub extends CreateRecord
{
    use Translatable;

    protected static string $resource = ClubResource::class;

    protected function getHeaderActions(): array
    {
        return [
            LocaleSwitcher::make(),
        ];
    }
}
