<?php

namespace App\Filament\Resources\Clubs\RelationManagers;

use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Model;
use App\Filament\Resources\Divisions\DivisionResource;
use Filament\Resources\RelationManagers\RelationManager;
use LaraZeus\SpatieTranslatable\Resources\Concerns\Translatable;

class DivisionsRelationManager extends RelationManager
{
    use Translatable;

    protected static string $relationship = 'divisions';

    public static function getTitle(Model $ownerRecord, string $pageClass): string
    {
        return trans_choice('division.label', 2);
    }

    public static function getModelLabel(): string
    {
        return trans_choice('division.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('division.label', 2);
    }

    public function form(Schema $schema): Schema
    {
        return DivisionResource::form($schema);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                //
            ])
            ->recordActions([
                //
            ])
            ->toolbarActions([
                //
            ]);
    }
}
