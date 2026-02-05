<?php

namespace App\Filament\Resources\Roles;

use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Spatie\Permission\Models\Role;
use Filament\Tables\Columns\TextColumn;
use App\Filament\Resources\Roles\Pages\ListRoles;

class RoleResource extends Resource
{
    protected static ?string $model = Role::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-lock-closed';

    protected static bool $isScopedToTenant = false;

    public static function getModelLabel(): string
    {
        return trans_choice('role.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('role.label', 2);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                // ,
            ])
            ->toolbarActions([
                // ,
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRoles::route('/'),
        ];
    }
}
