<?php

namespace App\Filament\Resources\Memberships\Pages;

use Filament\Resources\Pages\CreateRecord;
use App\Filament\Resources\Memberships\MembershipResource;

class CreateMembership extends CreateRecord
{
    protected static string $resource = MembershipResource::class;
}
