<?php

namespace App\Filament\Resources\Members\Pages;

use Filament\Resources\Pages\CreateRecord;
use App\Filament\Resources\Members\MemberResource;

class CreateMember extends CreateRecord
{
    protected static string $resource = MemberResource::class;
}
